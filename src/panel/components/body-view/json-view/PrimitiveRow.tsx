import * as React from 'react'
import { useState } from 'react'

import { Clear as ClearIcon } from '@/icons'

import KeyView from './KeyView'
import PrimitiveView from './PrimitiveView'

import type { JSONPrimitive, JSONValue } from '../JSON'

interface Props {
  k: string
  v: JSONPrimitive
  keyEditable: boolean
  depth: number
  onChangeKey?: (k: string) => void
  onChangeValue?: (v: JSONValue) => void
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
}: Props) => {
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

export default PrimitiveRow
