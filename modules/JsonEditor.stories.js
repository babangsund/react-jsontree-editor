import React from "react"
import { storiesOf } from "@storybook/react"
import { JsonEditor } from "../modules"

storiesOf("JsonEditor", module).add("default", () => (
  <JsonEditor
    jsonTree={{
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
    }}
  />
))
