import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import { Add as AddIcon, Remove as RemoveIcon } from '@/icons'

import { JSONPrimitive, isArray, isObject, isPrimitive } from '../JSON'

import KeyView from './KeyView'
import PrimitiveView from './PrimitiveView'

import type { JSONArray, JSONObject, JSONValue } from '../JSON'
import type { CSSProperties } from 'react'

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

interface RowProps<T extends JSONValue> {
  k: string
  v: T
  keyEditable: boolean
  style?: CSSProperties
  depth?: number
  onChangeKey?: (k: string) => void
  onChangeValue?: (v: T) => void
}

const PrimitiveRow = ({
  k,
  v,
  style = {},
  onChangeKey,
  onChangeValue,
  keyEditable = onChangeKey !== undefined,
}: RowProps<JSONPrimitive>) => (
  <div className="flex items-baseline space-x-1" style={style}>
    <KeyView name={k} editable={keyEditable} onChange={onChangeKey} />
    <PrimitiveView value={v} onChange={onChangeValue} />
  </div>
)

const ObjectRow = ({
  k,
  v,
  keyEditable,
  style = {},
  depth = 0,
  onChangeKey,
  onChangeValue,
}: RowProps<JSONArray | JSONObject>) => {
  const [folded, setFolded] = useState(depth >= 1)

  const [leftGuard, rightGuard] = useMemo(() => {
    if (isArray(v)) {
      return ['[', ']']
    } else if (isObject(v)) {
      return ['{', '}']
    }
    throw new Error('invalid JSON value')
  }, [v])

  const onToggleFolded = useCallback(() => {
    setFolded((f) => !f)
  }, [])

  const button = useMemo(() => {
    return (
      <button
        className="mx-0.5 rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-600"
        onClick={onToggleFolded}
      >
        {folded ? <AddIcon /> : <RemoveIcon />}
      </button>
    )
  }, [folded, onToggleFolded])

  return (
    <>
      <div className="flex items-baseline space-x-1" style={style}>
        <KeyView name={k} editable={keyEditable} onChange={onChangeKey} />
        <pre className="flex items-center space-x-0.5">
          {leftGuard}
          {button}
          {rightGuard}
        </pre>
      </div>
      <ObjectView
        obj={v}
        depth={depth + 1}
        folded={folded}
        onChange={onChangeValue}
      />
    </>
  )
}

interface Props {
  obj: JSONObject | JSONArray
  folded: boolean
  depth: number
  onChange?: (obj: JSONObject | JSONArray) => void
}

const ObjectView = ({ obj, depth, onChange, folded }: Props) => {
  const style: CSSProperties = useMemo(
    () => ({ marginLeft: `${depth}rem` }),
    [depth]
  )

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

  const rows = useMemo<React.ReactNode[]>(() => {
    const items = []
    for (const [k, v] of Object.entries(obj)) {
      if (isPrimitive(v)) {
        items.push(
          <PrimitiveRow
            key={k}
            {...{ k, v, style }}
            keyEditable={!isArray(obj)}
            onChangeKey={(newK) => onChangeKey(k, newK)}
            onChangeValue={(newV) => onChangeValue(k, newV)}
          />
        )
      } else if (isArray(v) || isObject(v)) {
        items.push(
          <ObjectRow
            key={k}
            {...{ k, v, style, depth }}
            keyEditable={!isArray(obj)}
            onChangeKey={(newK) => onChangeKey(k, newK)}
            onChangeValue={(newV) => onChangeValue(k, newV)}
          />
        )
      } else {
        throw new Error('invalid JSON value')
      }
    }
    return items
  }, [obj, style, onChangeKey, onChangeValue, depth])

  return <div className={'space-y-1' + (folded ? ' hidden' : '')}>{rows}</div>
}

export default ObjectView
