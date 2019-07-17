// @flow
import { set } from "lodash-es"
import HTML5Backend from "react-dnd-html5-backend"
import React, { useReducer, useCallback } from "react"
import { DndProvider, useDrop, useDrag } from "react-dnd"

import type { JsonType, DispatchType } from "./types"
import { JsonContext, DispatchContext } from "./context"

function JsonEditor() {
  const node = React.useContext(JsonContext)
  return (
    <DndProvider backend={HTML5Backend}>
      <JsonTree node={node} />
    </DndProvider>
  )
}

function JsonTree({
  node,
  parentPath,
  index = 0
}: {
  node: JsonType,
  index?: number,
  parentPath?: Array<number | string>
}) {
  const dispatch: DispatchType = React.useContext(DispatchContext)
  const { label, items }: { label: string, items: Array<JsonType> } = node

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
        dispatch(tree => {
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
          {(items || []).map((node, index) => (
            <JsonTree node={node} index={index} key={node.label} parentPath={path} />
          ))}
        </div>
      )}
    </div>
  )
}

export default JsonEditor
