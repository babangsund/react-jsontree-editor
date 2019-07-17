// @flow
export type JsonType = { label: string, items: Array<JsonType> }
export type DispatchType = ((JsonType => JsonType) | JsonType | string) => void
