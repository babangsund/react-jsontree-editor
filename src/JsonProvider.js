// @flow
import React from "react"
import type { Node } from "react"
import { cloneDeep } from "lodash-es"

import type { JsonType, DispatchType } from "./types"
import { DispatchContext, JsonContext } from "./context"

type ReducerProps = {
  present: JsonType,
  past: Array<JsonType>,
  future: Array<JsonType>
}

function historyReducer(state: ReducerProps, action: any) {
  const { past, present, future } = state
  const previous = cloneDeep(present)
  switch (action) {
    case "UNDO": {
      if (!past.length) return state
      return {
        future: [...future, previous],
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1]
      }
    }
    case "REDO": {
      if (!future.length) return state
      const newPast = [...past, previous]
      const [newPresent, ...newFuture] = future
      return {
        past: newPast,
        future: newFuture,
        present: newPresent
      }
    }
    default: {
      const newPast = [...past, previous]
      const newPresent = action(present)
      return {
        future: [],
        past: newPast,
        present: newPresent
      }
    }
  }
}

function useHistory(initialTree): [JsonType, DispatchType] {
  const [{ present }, dispatch] = React.useReducer(historyReducer, {
    past: [cloneDeep(initialTree)],
    present: initialTree,
    future: []
  })
  return [present, dispatch]
}

export default function JsonProvider({ json, children }: { json: JsonType, children: Node }) {
  const [state, dispatch] = useHistory(json)
  return (
    <DispatchContext.Provider value={dispatch}>
      <JsonContext.Provider value={state}>{children}</JsonContext.Provider>
    </DispatchContext.Provider>
  )
}
