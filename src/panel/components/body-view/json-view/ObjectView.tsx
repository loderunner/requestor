import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import {
  Add as AddIcon,
  Clear as ClearIcon,
  Plus as PlusIcon,
  Remove as RemoveIcon,
} from '@/icons'

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
  depth: number
  onChangeKey?: (k: string) => void
  onChangeValue?: (v: T) => void
  onDelete?: () => void
}

const PrimitiveRow = ({
  k,
  v,
  depth,
  onChangeKey,
  onChangeValue,
  onDelete,
  keyEditable = onChangeKey !== undefined,
}: RowProps<JSONPrimitive>) => {
  const [hovering, setHovering] = useState(false)

  return (
    <div
      className="mt-1 flex items-center space-x-1"
      style={{ marginLeft: `${depth}rem` }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <button
        className={`rounded-sm bg-red-500 hover:bg-red-600 active:bg-red-700 ${
          hovering ? '' : ' invisible'
        }`}
      >
        <ClearIcon className="fill-white" onClick={onDelete} />
      </button>
      <KeyView name={k} editable={keyEditable} onChange={onChangeKey} />
      <PrimitiveView value={v} onChange={onChangeValue} />
    </div>
  )
}

const ObjectRow = ({
  k,
  v,
  keyEditable,
  depth,
  onChangeKey,
  onChangeValue,
  onDelete,
}: RowProps<JSONArray | JSONObject>) => {
  const [hovering, setHovering] = useState(false)
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

  const foldButton = useMemo(() => {
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
      <div
        className="mt-1 flex items-center space-x-1"
        style={{ marginLeft: `${depth}rem` }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button
          className={`rounded-sm bg-red-500 hover:bg-red-600 active:bg-red-700 ${
            hovering ? '' : 'invisible'
          }`}
          onClick={onDelete}
        >
          <ClearIcon className="fill-white" />
        </button>
        <KeyView name={k} editable={keyEditable} onChange={onChangeKey} />
        <pre className="flex items-center space-x-0.5">
          {leftGuard}
          {foldButton}
          {rightGuard}
        </pre>
      </div>
      <ObjectView
        className={`${folded ? 'hidden' : ''}`}
        obj={v}
        depth={depth + 1}
        onChange={onChangeValue}
      />
    </>
  )
}

interface AddButtonProps {
  depth: number
  onClick?: () => void
}

const AddButton = ({ depth, onClick }: AddButtonProps) => (
  <button
    className="absolute h-2 -mt-0.5 first:-mt-1.5 group opacity-0 hover:opacity-100"
    style={{
      marginLeft: `${depth + 1}rem`,
      width: `calc(100% - ${depth + 1}rem)`,
      zIndex: depth,
    }}
    onClick={onClick}
  >
    <div className="absolute left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-300 group-hover:bg-slate-400 group-active:bg-slate-500" />
    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-sm bg-white border-slate-300 group-hover:border-slate-400 group-active:border-slate-500">
      <PlusIcon className=" fill-slate-300  group-hover:fill-slate-400 group-active:fill-slate-500" />
    </div>
  </button>
)
interface Props {
  obj: JSONObject | JSONArray
  depth: number
  className?: string
  onChange?: (obj: JSONObject | JSONArray) => void
}

const ObjectView = ({ obj, depth, onChange, className = '' }: Props) => {
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

  const rows = useMemo<React.ReactNode[]>(() => {
    const items = []
    for (const [i, [k, v]] of [...Object.entries(obj)].entries()) {
      items.push(<AddButton key={`add-button-${i}`} depth={depth} />)
      if (isPrimitive(v)) {
        items.push(
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
        items.push(
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
    items.push(
      <AddButton
        key={`add-button-${Object.entries(obj).length}`}
        depth={depth}
      />
    )
    return items
  }, [obj, depth, onChangeKey, onChangeValue, onDelete])

  return <div className={`relative ${className}`}>{rows}</div>
}

export default ObjectView
