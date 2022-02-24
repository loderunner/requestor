import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { MoreHoriz as MoreHorizIcon } from '@/icons'

import ModalInput from '../ModalInput'

import type { CSSProperties, MutableRefObject, SyntheticEvent } from 'react'

type JSONArray = JSONValue[]
type JSONObject = { [key: string]: JSONValue }
type JSONPrimitive = null | boolean | number | string
type JSONValue = JSONPrimitive | JSONArray | JSONObject

const isPrimitive = (value: JSONValue): value is JSONPrimitive =>
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  typeof value === 'string' ||
  value === null
const isArray = (value: JSONValue): value is JSONArray => value instanceof Array
const isObject = (value: JSONValue): value is JSONObject =>
  value instanceof Object

interface PrimitiveProps {
  value: JSONPrimitive
  onChange: (value: JSONPrimitive) => void
}

const PrimitiveView = ({ value, onChange }: PrimitiveProps) => {
  const preRef = useRef<HTMLPreElement>(null)
  const [editing, setEditing] = useState(false)

  const onDoubleClick = useCallback((e: SyntheticEvent) => {
    if (!preRef.current) {
      return
    }
    e.stopPropagation()
    setEditing(true)
  }, [])

  const onChangeInput = useCallback(
    (value) => {
      onChange(JSON.parse(value))
      setEditing(false)
    },
    [onChange]
  )

  const onCancelInput = useCallback(() => setEditing(false), [])

  const textColor = useMemo(() => {
    switch (typeof value) {
      case 'boolean':
        return 'text-green-500'
      case 'number':
        return 'text-rose-500'
      case 'string':
        return 'text-sky-400'
      case 'object': {
        if (value === null) {
          return 'text-purple-500'
        }
      }
      // fall through
      default:
        throw new Error('invalid JSON value')
    }
  }, [value])

  return (
    <div className="flex-auto">
      <pre
        className={`whitespace-pre-wrap break-all ${textColor}`}
        ref={preRef}
        onDoubleClick={onDoubleClick}
      >
        {JSON.stringify(value)}
      </pre>
      {editing && preRef.current ? (
        <ModalInput
          element={preRef.current}
          value={JSON.stringify(value)}
          onChange={onChangeInput}
          onCancel={onCancelInput}
        />
      ) : null}
    </div>
  )
}

interface ObjectProps {
  obj: JSONObject | JSONArray
  depth: number
  foldButtonRef?: MutableRefObject<HTMLButtonElement | null>
  onChange: (obj: JSONObject | JSONArray) => void
}

const ObjectView = ({ obj, depth, foldButtonRef, onChange }: ObjectProps) => {
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

  const rows = useMemo<React.ReactNode[]>(() => {
    const items = []
    for (const [k, v] of Object.entries(obj)) {
      if (isPrimitive(v)) {
        items.push(
          <div key={k} className="flex items-baseline space-x-1" style={style}>
            <pre className="text-amber-700">{k}:</pre>
            <PrimitiveView
              value={v}
              onChange={(newV) => onChange({ ...obj, [k]: newV })}
            />
          </div>
        )
      } else if (isArray(v) || isObject(v)) {
        items.push(
          <ObjectRows
            key={k}
            {...{ k, v, style, depth }}
            onChange={(newV) => onChange({ ...obj, [k]: newV })}
          />
        )
      } else {
        throw new Error('invalid JSON value')
      }
    }
    return items
  }, [obj, style, onChange, depth])

  return <div className={'space-y-1' + (folded ? ' hidden' : '')}>{rows}</div>
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

  return (
    <>
      <div key={k} className="flex items-baseline space-x-1" style={style}>
        <pre className="text-amber-700">{k}:</pre>
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
      return <ObjectView obj={value} depth={0} onChange={onBodyChange} />
    }
    throw new Error('invalid JSON value')
  }, [onBodyChange, value])
  return view
}

export default JSONBodyView
