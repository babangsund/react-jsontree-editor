import React from "react"
import { storiesOf } from "@storybook/react"
import { JsonProvider, JsonEditor, Undo, Redo } from "../dist/esm/react-json-editor"

const json = {
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

storiesOf("JsonEditor", module)
  .add("default", () => (
    <div>
      <JsonProvider json={json}>
        <Undo />
        <Redo />
        <JsonEditor />
      </JsonProvider>
    </div>
  ))
  .add("without history", () => (
    <JsonProvider json={json}>
      <JsonEditor />
    </JsonProvider>
  ))
