import { set, cloneDeep } from "lodash-es"
import HTML5Backend from "react-dnd-html5-backend"
import React, { useReducer, useCallback } from "react"
import { DndProvider, useDrop, useDrag } from "react-dnd"

function historyReducer({ past, present, future }, action) {
  switch (action) {
    case "UNDO": {
      return {
        future: [...future, cloneDeep(present)],
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1]
      }
    }
    case "REDO": {
      const newPast = [...past, cloneDeep(present)]
      const [newPresent, ...newFuture] = future
      return {
        past: newPast,
        future: newFuture,
        present: newPresent
      }
    }
    default: {
      const newPast = [...past, cloneDeep(present)]
      const newPresent = action(present)
      return {
        future: [],
        past: newPast,
        present: newPresent
      }
    }
  }
}
function useHistory(initialTree) {
  const [{ present }, dispatch] = React.useReducer(historyReducer, {
    past: [cloneDeep(initialTree)],
    present: initialTree,
    future: []
  })
  return [present, dispatch]
}

function JsonEditor({ jsonTree }) {
  const [tree, setTree] = useHistory(jsonTree)

  return (
    <DndProvider backend={HTML5Backend}>
      <div onClick={() => setTree("UNDO")}>undo</div>
      <div onClick={() => setTree("REDO")}>redo</div>
      <JsonTree node={tree} onTreeChange={setTree} />
    </DndProvider>
  )
}

function JsonTree({ node, parentPath, index = 0, onTreeChange }) {
  const { label, items } = node

  const [isOpen, toggle] = useReducer(bool => !bool, false)
  const path = !parentPath ? [] : [...parentPath, "items", index]
  const item = {
    ...node,
    path,
    type: "ITEM"
  }

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "ITEM",
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: (drop, monitor) => {
      if (!monitor.didDrop()) {
        const target = item
        onTreeChange(tree => {
          let copy = Object.assign({}, tree)
          set(copy, drop.path, target)
          set(copy, target.path, drop)
          return copy
        })
      }
    }
  })

  const [{ isDragging }, drag] = useDrag({
    item,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const isActive = canDrop && isOver
  let backgroundColor = "white"
  if (isDragging) {
    backgroundColor = "lime"
  }
  if (isActive) {
    backgroundColor = "teal"
  } else if (canDrop) {
    backgroundColor = "pink"
  }

  const setRefs = useCallback(
    ref => {
      drop(ref)
      drag(ref)
    },
    [drop, drag]
  )

  return (
    <div ref={setRefs} style={{ backgroundColor }}>
      <div onClick={toggle}>{label}</div>
      {isOpen && (
        <div style={{ paddingLeft: 16 }}>
          {items?.map((node, index) => (
            <JsonTree
              node={node}
              index={index}
              key={node.label}
              parentPath={path}
              onTreeChange={onTreeChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default JsonEditor
