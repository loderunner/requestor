import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import ObjectView from './json-view/ObjectView'
import PrimitiveView from './json-view/PrimitiveView'

export type JSONArray = JSONValue[]
export type JSONObject = { [key: string]: JSONValue }
export type JSONPrimitive = null | boolean | number | string
export type JSONValue = JSONPrimitive | JSONArray | JSONObject

export const isPrimitive = (value: JSONValue): value is JSONPrimitive =>
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  typeof value === 'string' ||
  value === null
export const isArray = (value: JSONValue): value is JSONArray =>
  value instanceof Array
export const isObject = (value: JSONValue): value is JSONObject =>
  value instanceof Object

interface Props {
  jsonData: string
  onChange?: (body?: string) => void
}

const JSONBodyView = ({ jsonData, onChange }: Props) => {
  const [value, setValue] = useState<JSONValue>(() => JSON.parse(jsonData))
  const onBodyChange = useCallback(
    (newValue: JSONValue) => {
      setValue(newValue)
      if (onChange !== undefined) {
        onChange(JSON.stringify(newValue))
      }
    },
    [onChange]
  )
  const view = useMemo(() => {
    if (isPrimitive(value)) {
      return <PrimitiveView value={value} onChange={onBodyChange} />
    } else if (isArray(value) || isObject(value)) {
      return (
        <ObjectView
          obj={value}
          depth={0}
          folded={false}
          onChange={onBodyChange}
        />
      )
    }
    throw new Error('invalid JSON value')
  }, [onBodyChange, value])
  return view
}

export default JSONBodyView
