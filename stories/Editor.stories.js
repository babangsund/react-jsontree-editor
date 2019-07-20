import React from "react"
import { storiesOf } from "@storybook/react"
import { useHistory, Editor } from "../dist/index.esm.js"

const data = {
  id: "1",
  label: "hello world",
  items: [
    {
      id: "1-1",
      label: "First",
      items: [
        {
          label: "First-Second"
        }
      ]
    },
    {
      id: "1-2",
      label: "Second",
      items: [
        {
          label: "Second-Second"
        }
      ]
    },
    {
      id: "1-3",
      label: "Third",
      items: [
        {
          label: "Third-Second"
        }
      ]
    }
  ]
}

function renderNode({ node, onToggle }) {
  function onClick() {
    alert("selected " + node.label)
  }
  return (
    <div>
      <span onClick={onToggle}>&gt; </span>
      <span onClick={onClick}>{node.label}</span>
    </div>
  )
}

function Basic() {
  const [json, onChange] = React.useState(data)
  return <Editor node={json} onChange={onChange} renderNode={renderNode} />
}

function Display() {
  const [json, onChange] = React.useState(data)
  return (
    <>
      <Editor node={json} onChange={onChange} renderNode={renderNode} />
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </>
  )
}

function Save() {
  const [json, onChange] = React.useState(data)
  return (
    <>
      <button onClick={() => alert("Emitted:\n" + JSON.stringify(json, null, 2))}>Save</button>
      <Editor node={json} onChange={onChange} renderNode={renderNode} />
    </>
  )
}

function History() {
  const [json, { onChange, onUndo, onRedo }] = useHistory(data)
  return (
    <>
      <button onClick={onUndo}>Undo</button>
      <button onClick={onRedo}>Redo</button>
      <Editor node={json} onChange={onChange} renderNode={renderNode} />
    </>
  )
}

storiesOf("Editor", module)
  .add("Basic", () => <Basic />)
  .add("With change history", () => <History />)
  .add("With a raw display", () => <Display />)
  .add("With a save button", () => <Save />)
