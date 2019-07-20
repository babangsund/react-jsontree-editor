// @flow
import * as React from "react"
import { cloneDeep } from "lodash-es"

import type { JsonType } from "./types"

type HistoryProviderReturns = [
  JsonType,
  {
    onUndo: void => void,
    onRedo: void => void,
    onChange: JsonType => void
  }
]

export function useHistory(initial: JsonType): HistoryProviderReturns {
  const [{ present }, setHistory] = React.useState({
    present: cloneDeep(initial),
    future: [],
    past: []
  })

  const previous = React.useMemo(() => cloneDeep(present), [present])

  const onChange = React.useCallback(
    newPresent => {
      setHistory(({ past }) => {
        return {
          future: [],
          present: newPresent,
          past: [...past, previous]
        }
      })
    },
    [previous]
  )

  const onUndo = React.useCallback(() => {
    setHistory(state => {
      const { past, future } = state
      if (!state.past.length) return state
      return {
        future: [...future, previous],
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1]
      }
    })
  }, [previous])

  const onRedo = React.useCallback(() => {
    setHistory(state => {
      if (!state.future.length) return state
      const { past, future } = state

      const newPast = [...past, previous]
      const [newPresent, ...newFuture] = future

      return {
        past: newPast,
        future: newFuture,
        present: newPresent
      }
    })
  }, [previous])

  return [
    present,
    React.useMemo(
      () => ({
        onUndo,
        onRedo,
        onChange
      }),
      [onChange, onUndo, onRedo]
    )
  ]
}
