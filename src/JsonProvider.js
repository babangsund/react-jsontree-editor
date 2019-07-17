// @flow
import * as React from "react"
import { cloneDeep } from "lodash-es"

import type { JsonType, DispatchType } from "./types"
import { DispatchContext, JsonContext } from "./context"

type JsonProviderProps = {
  json: JsonType,
  children: React.Node
}

type State = {
  past: JsonType[],
  present: JsonType,
  future: JsonType[]
}

type Action = string | (JsonType => JsonType)

function historyReducer(state: State, action: Action): State {
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
      if (typeof action !== "function") return state
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

function useHistory(initialTree: JsonType): [JsonType, DispatchType] {
  initialTree = typeof initialTree === "string" ? JSON.parse(initialTree) : initialTree
  const [{ present }, dispatch] = React.useReducer(historyReducer, {
    past: [cloneDeep(initialTree)],
    present: initialTree,
    future: []
  })
  return [present, dispatch]
}

export function useJson() {
  return React.useContext(JsonContext)
}

export function useDispatch() {
  return React.useContext(DispatchContext)
}

export function useUndo() {
  const dispatch = React.useContext(DispatchContext)
  return React.useCallback(() => dispatch("UNDO"), [dispatch])
}

export function useRedo() {
  const dispatch = React.useContext(DispatchContext)
  return React.useCallback(() => dispatch("REDO"), [dispatch])
}

export function JsonProvider({ json, children }: JsonProviderProps) {
  const [state, dispatch] = useHistory(json)
  return (
    <DispatchContext.Provider value={dispatch}>
      <JsonContext.Provider value={state}>{children}</JsonContext.Provider>
    </DispatchContext.Provider>
  )
}
