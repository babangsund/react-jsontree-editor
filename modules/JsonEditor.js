import { set } from "lodash-es"
import HTML5Backend from "react-dnd-html5-backend"
import React, { useReducer, useCallback } from "react"
import { DndProvider, useDrop, useDrag } from "react-dnd"

function JsonEditor({ jsonTree }) {
  const [tree, setTree] = React.useState(jsonTree)
  return (
    <DndProvider backend={HTML5Backend}>
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
              key={node.label}
              node={node}
              index={index}
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
