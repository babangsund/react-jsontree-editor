// @flow
import * as React from "react"
import { set } from "lodash-es"
import HTML5Backend from "react-dnd-html5-backend"
import { DndProvider, useDrop, useDrag } from "react-dnd"

import type { JsonType, DispatchType } from "./types"
import { JsonContext, DispatchContext } from "./context"

type DragDroppableProps = {
  isOver: boolean,
  canDrop: boolean
}

type Props = {
  Label: React.AbstractComponent<any>,
  Indented: React.AbstractComponent<any>,
  DragDroppable: React.AbstractComponent<DragDroppableProps>
}

const DefaultLabel = props => <div {...props} />
const DefaultIndented = props => <div {...props} style={{ paddingLeft: 16 }} />
const DefaultDragDroppable = React.forwardRef(({ isOver, canDrop, ...other }, ref) => (
  <div
    {...other}
    ref={ref}
    style={{
      backgroundColor: isOver && canDrop ? "teal" : canDrop ? "hotpink" : "white"
    }}
  />
))

export function JsonEditor({
  Label = DefaultLabel,
  Indented = DefaultIndented,
  DragDroppable = DefaultDragDroppable
}: Props) {
  const node = React.useContext(JsonContext)
  return (
    <DndProvider backend={HTML5Backend}>
      <JsonTree node={node} Label={Label} Indented={Indented} DragDroppable={DragDroppable} />
    </DndProvider>
  )
}

function JsonTree({
  node,
  Label,
  Indented,
  index = 0,
  parentPath,
  DragDroppable
}: {
  node: JsonType,
  index?: number,
  parentPath?: Array<number | string>,
  Label: React.AbstractComponent<any>,
  Indented: React.AbstractComponent<any>,
  DragDroppable: React.AbstractComponent<DragDroppableProps>
}) {
  const dispatch: DispatchType = React.useContext(DispatchContext)
  const { label, items }: { label: string, items: JsonType[] } = node

  const [isOpen, toggle] = React.useReducer(bool => !bool, false)
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
    drop: ({ type, path: dropPath, ...drop }, monitor) => {
      if (!monitor.didDrop()) {
        dispatch(tree => {
          let copy = Object.assign({}, tree)
          set(copy, dropPath, node)
          set(copy, path, drop)
          return copy
        })
      }
    }
  })

  const [, drag] = useDrag({
    item,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const setRefs = React.useCallback(
    ref => {
      drop(ref)
      drag(ref)
    },
    [drop, drag]
  )

  return (
    <DragDroppable ref={setRefs} isOver={isOver} canDrop={canDrop}>
      <Label onClick={toggle}>{label}</Label>
      {isOpen && (
        <Indented>
          {(items || []).map((node, index) => (
            <JsonTree
              node={node}
              index={index}
              Label={Label}
              key={node.label}
              parentPath={path}
              Indented={Indented}
              DragDroppable={DragDroppable}
            />
          ))}
        </Indented>
      )}
    </DragDroppable>
  )
}
