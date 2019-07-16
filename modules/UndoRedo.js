// @flow
import React from "react"

import { DispatchContext } from "./context"

export function Undo() {
  const dispatch = React.useContext(DispatchContext)
  return <div onClick={() => dispatch("UNDO")}>Undo</div>
}

export function Redo() {
  const dispatch = React.useContext(DispatchContext)
  return <div onClick={() => dispatch("REDO")}>Redo</div>
}
