// @flow
import * as React from "react"
import { set } from "lodash-es"
import HTML5Backend from "react-dnd-html5-backend"
import { DndProvider, useDrop, useDrag } from "react-dnd"

import type { JsonType } from "./types"

type DragDroppableProps = {
  isOver: boolean,
  canDrop: boolean
}

type EditorProps = {|
  onChange: JsonType => void
|}

type NodeProps = {|
  index?: number,
  parentPath?: Array<number | string>,
  onChange: ((JsonType) => JsonType) => void
|}

type RenderNodeParameters = ({
  node: JsonType,
  onToggle: void => void
}) => React.AbstractComponent<{}>

type SharedProps = {|
  style?: {},
  node: JsonType,
  className?: string,
  renderNode: RenderNodeParameters,
  Label: React.AbstractComponent<{}>,
  Indented: React.AbstractComponent<{}>,
  DragDroppable: React.AbstractComponent<DragDroppableProps>
|}

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

export function Editor({
  node,
  onChange: onMove,
  Label = DefaultLabel,
  Indented = DefaultIndented,
  DragDroppable = DefaultDragDroppable,
  ...props
}: {
  ...SharedProps,
  ...EditorProps
}) {
  function onChange(fn: JsonType => JsonType) {
    return onMove(fn(node))
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <Node
        node={node}
        Label={Label}
        onChange={onChange}
        Indented={Indented}
        DragDroppable={DragDroppable}
        {...props}
      />
    </DndProvider>
  )
}

function Node({
  node,
  style,
  Label,
  onChange,
  Indented,
  className,
  index = 0,
  parentPath,
  renderNode,
  DragDroppable
}: {
  ...SharedProps,
  ...NodeProps
}) {
  const { items } = node

  const [isOpen, onToggle] = React.useReducer(bool => !bool, false)
  const path = !parentPath ? [] : [...parentPath, "items", index]

  const item = {
    ...node,
    path,
    type: "ITEM"
  }

  const [, drag] = useDrag({
    item,
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: "ITEM",
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: ({ type, path: dropPath, ...drop }, monitor) => {
      if (!monitor.didDrop()) {
        onChange(tree => {
          let copy = Object.assign({}, tree)
          set(copy, dropPath, node)
          set(copy, path, drop)
          return copy
        })
      }
    }
  })

  const setRefs = React.useCallback(
    ref => {
      drop(ref)
      drag(ref)
    },
    [drop, drag]
  )

  return (
    <DragDroppable
      ref={setRefs}
      style={style}
      isOver={isOver}
      canDrop={canDrop}
      className={className}
    >
      {renderNode({ node, onToggle })}
      {isOpen && (
        <Indented>
          {(items || []).map((node, index) => (
            <Node
              node={node}
              key={node.id}
              style={style}
              index={index}
              Label={Label}
              parentPath={path}
              onChange={onChange}
              Indented={Indented}
              className={className}
              renderNode={renderNode}
              DragDroppable={DragDroppable}
            />
          ))}
        </Indented>
      )}
    </DragDroppable>
  )
}
