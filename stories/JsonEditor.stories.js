import React from "react"
import { storiesOf } from "@storybook/react"
import { useHistory, JsonEditor } from "../dist/index.esm.js"

const data = {
  label: "hello world",
  items: [
    {
      label: "First",
      items: [
        {
          label: "First-Second"
        }
      ]
    },
    {
      label: "Second",
      items: [
        {
          label: "Second-Second"
        }
      ]
    },
    {
      label: "Third",
      items: [
        {
          label: "Third-Second"
        }
      ]
    }
  ]
}

function Basic() {
  const [json, onChange] = React.useState(data)
  return <JsonEditor node={json} onMove={onChange} />
}

function Display() {
  const [json, onChange] = React.useState(data)
  return (
    <>
      <JsonEditor node={json} onMove={onChange} />
      <pre>{JSON.stringify(json, null, 2)}</pre>
    </>
  )
}

function Save() {
  const [json, onChange] = React.useState(data)
  return (
    <>
      <button onClick={() => alert("Emitted:\n" + JSON.stringify(json, null, 2))}>Save</button>
      <JsonEditor node={json} onMove={onChange} />
    </>
  )
}

function History() {
  const [json, { onChange, onUndo, onRedo }] = useHistory(data)
  return (
    <>
      <button onClick={onUndo}> Undo</button>
      <button onClick={onRedo}> Redo</button>
      <JsonEditor node={json} onMove={onChange} />
    </>
  )
}

storiesOf("JsonEditor", module)
  .add("Basic", () => <Basic />)
  .add("With change history", () => <History />)
  .add("With a raw display", () => <Display />)
  .add("With a save button", () => <Save />)
