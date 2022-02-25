import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { MoreHoriz as MoreHorizIcon } from '@/icons'

import { isArray, isObject, isPrimitive } from '../JSON'

import KeyView from './KeyView'
import PrimitiveView from './PrimitiveView'

import type { JSONArray, JSONObject, JSONValue } from '../JSON'
import type { CSSProperties, MutableRefObject } from 'react'

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

interface RowsProps {
  k: string
  v: JSONObject | JSONArray
  style: CSSProperties
  depth: number
  onChange: (v: JSONValue | JSONArray) => void
}

const ObjectRows = ({ k, v, style, depth, onChange }: RowsProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [leftGuard, rightGuard] = useMemo(() => {
    if (isArray(v)) {
      return ['[', ']']
    } else if (isObject(v)) {
      return ['{', '}']
    }
    throw new Error('invalid JSON value')
  }, [v])

  const button = useMemo(() => {
    if (Object.keys(v).length === 0) {
      return null
    }
    return (
      <button
        className="rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-600"
        ref={buttonRef}
      >
        <MoreHorizIcon />
      </button>
    )
  }, [buttonRef, v])

  const onChangeKey = useMemo(() => {
    if (isArray(v)) {
      return
    }
    return (oldKey: string, newKey: string) =>
      onChange(replace(oldKey, newKey, v))
  }, [v, onChange])

  return (
    <>
      <div className="flex items-baseline space-x-1" style={style}>
        <KeyView name={k} editable={!isArray(v)} onChange={onChangeKey} />
        <pre className="flex items-center space-x-0.5">
          {leftGuard}
          {button}
          {rightGuard}
        </pre>
      </div>
      <ObjectView
        obj={v}
        depth={depth + 1}
        foldButtonRef={buttonRef}
        onChange={(newV) => onChange(newV)}
      />
    </>
  )
}

interface Props {
  obj: JSONObject | JSONArray
  depth: number
  foldButtonRef?: MutableRefObject<HTMLButtonElement | null>
  onChange?: (obj: JSONObject | JSONArray) => void
}

const ObjectView = ({ obj, depth, foldButtonRef, onChange }: Props) => {
  const [folded, setFolded] = useState(depth > 1)

  const style: CSSProperties = useMemo(
    () => ({ marginLeft: `${depth}rem` }),
    [depth]
  )

  const onToggleFolded = useCallback(() => setFolded((f) => !f), [])

  useEffect(() => {
    if (foldButtonRef?.current) {
      foldButtonRef.current.onclick = onToggleFolded
    }
  })

  const onChangeKey = useMemo(() => {
    if (isArray(obj)) {
      return
    }
    return (oldKey: string, newKey: string) => {
      if (onChange !== undefined) {
        onChange(replace(oldKey, newKey, obj))
      }
    }
  }, [obj, onChange])

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
          <div key={k} className="flex items-baseline space-x-1" style={style}>
            <KeyView name={k} editable={!isArray(obj)} onChange={onChangeKey} />
            <PrimitiveView
              value={v}
              onChange={(newV) => onChangeValue(k, newV)}
            />
          </div>
        )
      } else if (isArray(v) || isObject(v)) {
        items.push(
          <ObjectRows
            key={k}
            {...{ k, v, style, depth }}
            onChange={(newV) => onChangeValue(k, newV)}
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
