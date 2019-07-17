import React from "react"
import { storiesOf } from "@storybook/react"
import { JsonProvider, JsonEditor, useRedo, useUndo, useJson } from "../dist/index.esm.js"

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

function Display() {
  const json = useJson()
  return <pre>{JSON.stringify(json, null, 2)}</pre>
}

function Save() {
  const json = useJson()
  return <button onClick={() => alert("Emitted:\n" + JSON.stringify(json, null, 2))}>Save</button>
}

function History() {
  const undo = useUndo()
  const redo = useRedo()
  return (
    <>
      <button onClick={undo}> Undo</button>
      <button onClick={redo}> Redo</button>
    </>
  )
}

storiesOf("JsonEditor", module)
  .add("Providing a JS tree", () => (
    <JsonProvider json={data}>
      <JsonEditor />
    </JsonProvider>
  ))
  .add("Providing a JSON tree", () => (
    <JsonProvider json={JSON.stringify(data)}>
      <JsonEditor />
    </JsonProvider>
  ))
  .add("With change history", () => (
    <JsonProvider json={JSON.stringify(data)}>
      <History />
      <JsonEditor />
    </JsonProvider>
  ))
  .add("With a save button", () => (
    <JsonProvider json={JSON.stringify(data)}>
      <Save />
      <JsonEditor />
    </JsonProvider>
  ))
  .add("Reacting to state changes", () => (
    <JsonProvider json={JSON.stringify(data)}>
      <JsonEditor />
      <Display />
    </JsonProvider>
  ))
  .add("All together", () => (
    <JsonProvider json={JSON.stringify(data)}>
      <History />
      <Save />
      <JsonEditor />
      <Display />
    </JsonProvider>
  ))
