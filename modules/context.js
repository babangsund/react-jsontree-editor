// @flow
import React from "react"

import type { JsonType, DispatchType } from "./types"

export const JsonContext = React.createContext<JsonType>({})
export const DispatchContext = React.createContext<DispatchType>(() => {})
