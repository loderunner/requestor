import * as React from 'react'
import { useCallback, useState } from 'react'

import { isArray, isObject, isPrimitive } from '../JSON'

import AddButton from './AddButton'
import AddRow from './AddRow'
import ObjectRow from './ObjectRow'
import PrimitiveRow from './PrimitiveRow'

import type { JSONArray, JSONObject, JSONValue } from '../JSON'

const replace = (
  oldKey: string,
  newKey: string,
  obj: JSONObject
): JSONObject => {
  const newObj: JSONObject = {}
  for (const [k, v] of Object.entries(obj)) {
    if (k === oldKey) {
      newObj[newKey] = v
    } else {
      newObj[k] = v
    }
  }
  return newObj
}

const insertArray = (
  i: number,
  value: JSONValue,
  arr: JSONArray
): JSONArray => [...arr.slice(0, i), value, ...arr.slice(i)]

const insertObject = (
  index: number,
  key: string,
  value: JSONValue,
  obj: JSONObject
): JSONObject => {
  const newObj: JSONObject = {}
  for (const [i, [k, v]] of [...Object.entries(obj)].entries()) {
    if (i === index) {
      newObj[key] = value
    }
    newObj[k] = v
  }
  if (index === Object.entries(obj).length) {
    newObj[key] = value
  }
  return newObj
}

const insert = <T extends JSONObject | JSONArray>(
  index: number,
  key: string,
  value: JSONValue,
  obj: T
): JSONObject | JSONArray => {
  if (isArray(obj)) {
    return insertArray(index, value, obj)
  } else {
    return insertObject(index, key, value, obj)
  }
}
interface Props {
  obj: JSONObject | JSONArray
  depth: number
  className?: string
  onChange?: (obj: JSONObject | JSONArray) => void
}

const ObjectView = ({ obj, depth, onChange, className = '' }: Props) => {
  const [adding, setAdding] = useState(false)
  const [addingRow, setAddingRow] = useState(0)

  const onChangeKey = useCallback(
    (oldKey: string, newKey: string) => {
      if (isArray(obj)) {
        return
      }
      if (onChange !== undefined) {
        onChange(replace(oldKey, newKey, obj))
      }
    },
    [obj, onChange]
  )

  const onChangeValue = useCallback(
    (key: string, value: JSONValue) => {
      if (onChange !== undefined) {
        onChange({ ...obj, [key]: value })
      }
    },
    [obj, onChange]
  )

  const onDelete = useCallback(
    (key: string) => {
      let newObj: typeof obj
      if (isArray(obj)) {
        const k = parseInt(key)
        newObj = [...obj.slice(0, k), ...obj.slice(k + 1)]
      } else {
        // Drop [key] from obj with object destructuring syntax
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: _, ...rest } = obj
        newObj = rest
      }
      if (onChange !== undefined) {
        onChange(newObj)
      }
    },
    [obj, onChange]
  )

  const onAdd = useCallback(
    (index: number, key: string, value: JSONValue) => {
      if (onChange !== undefined) {
        onChange(insert(index, key, value, obj))
      }
      setAdding(false)
    },
    [obj, onChange]
  )

  const rows = []
  for (const [i, [k, v]] of [...Object.entries(obj)].entries()) {
    if (adding) {
      if (i === addingRow) {
        rows.push(
          <AddRow
            key={`add-row-${i}`}
            depth={depth}
            keyEditable={!isArray(obj)}
            onAdd={(k, v) => onAdd(i, k, v)}
            onCancel={() => setAdding(false)}
          />
        )
      }
    } else {
      rows.push(
        <AddButton
          key={`add-button-${i}`}
          depth={depth}
          onClick={() => {
            setAdding(true)
            setAddingRow(i)
          }}
        />
      )
    }
    if (isPrimitive(v)) {
      rows.push(
        <PrimitiveRow
          key={k}
          {...{ k, v, depth }}
          keyEditable={!isArray(obj)}
          onChangeKey={(newK) => onChangeKey(k, newK)}
          onChangeValue={(newV) => onChangeValue(k, newV)}
          onDelete={() => onDelete(k)}
        />
      )
    } else if (isArray(v) || isObject(v)) {
      rows.push(
        <ObjectRow
          key={k}
          {...{ k, v, depth }}
          keyEditable={!isArray(obj)}
          onChangeKey={(newK) => onChangeKey(k, newK)}
          onChangeValue={(newV) => onChangeValue(k, newV)}
          onDelete={() => onDelete(k)}
        />
      )
    } else {
      throw new Error('invalid JSON value')
    }
  }
  const i = Object.entries(obj).length
  if (adding) {
    if (i === addingRow) {
      rows.push(
        <AddRow
          key={`add-row-${i}`}
          depth={depth}
          keyEditable={!isArray(obj)}
          onAdd={(k, v) => onAdd(i, k, v)}
          onCancel={() => setAdding(false)}
        />
      )
    }
  } else {
    rows.push(
      <AddButton
        key={`add-button-${i}`}
        depth={depth}
        onClick={() => {
          setAdding(true)
          setAddingRow(i)
        }}
      />
    )
  }

  return <div className={`relative ${className}`}>{rows}</div>
}

export default ObjectView
