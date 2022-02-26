import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'

import {
  Add as AddIcon,
  Clear as ClearIcon,
  Remove as RemoveIcon,
} from '@/icons'

import { isArray, isObject } from '../JSON'

import KeyView from './KeyView'
import ObjectView from './ObjectView'

import type { JSONArray, JSONObject, JSONValue } from '../JSON'

interface Props {
  k: string
  v: JSONArray | JSONObject
  keyEditable: boolean
  depth: number
  onChangeKey?: (k: string) => void
  onChangeValue?: (v: JSONValue) => void
  onDelete?: () => void
}

const ObjectRow = ({
  k,
  v,
  keyEditable,
  depth,
  onChangeKey,
  onChangeValue,
  onDelete,
}: Props) => {
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

export default ObjectRow
