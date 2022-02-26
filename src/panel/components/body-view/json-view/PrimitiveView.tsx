import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import ModalInput from '../../ModalInput'

import type { JSONPrimitive } from '../JSON'
import type { SyntheticEvent } from 'react'

interface Props {
  value?: JSONPrimitive
  editingInitial?: boolean
  onChange?: (value: JSONPrimitive) => void
  onCancel?: () => void
}

const PrimitiveView = ({
  value,
  editingInitial = false,
  onChange,
  onCancel,
}: Props) => {
  const preRef = useRef<HTMLPreElement>(null)
  const [editing, setEditing] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => setEditing(editingInitial), [])

  const onDoubleClick = useCallback((e: SyntheticEvent) => {
    if (!preRef.current) {
      return
    }
    e.stopPropagation()
    setEditing(true)
  }, [])

  const onChangeInput = useCallback(
    (value) => {
      if (onChange !== undefined) {
        onChange(JSON.parse(value))
      }
      setEditing(false)
    },
    [onChange]
  )

  const onCancelInput = useCallback(() => {
    if (onCancel !== undefined) {
      onCancel()
    }
    setEditing(false)
  }, [onCancel])

  const textColor = useMemo(() => {
    switch (typeof value) {
      case 'undefined':
        return ''
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
        {value !== undefined ? JSON.stringify(value) : '\u200b'}
      </pre>
      {editing && preRef.current ? (
        <ModalInput
          element={preRef.current}
          value={value !== undefined ? JSON.stringify(value) : ''}
          onChange={onChangeInput}
          onCancel={onCancelInput}
        />
      ) : null}
    </div>
  )
}

export default PrimitiveView
