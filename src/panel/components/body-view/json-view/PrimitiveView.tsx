import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import ModalInput from '../../ModalInput'

import type { JSONPrimitive } from '../JSON'
import type { SyntheticEvent } from 'react'

interface Props {
  value?: JSONPrimitive
  onChange?: (value: JSONPrimitive) => void
  editingInitial?: boolean
}

const PrimitiveView = ({ value, onChange, editingInitial = false }: Props) => {
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

  const onCancelInput = useCallback(() => setEditing(false), [])

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

  const valueString = useMemo(
    () => (value !== undefined ? JSON.stringify(value) : ''),
    [value]
  )

  return (
    <div className="flex-auto">
      <pre
        className={`whitespace-pre-wrap break-all ${textColor}`}
        ref={preRef}
        onDoubleClick={onDoubleClick}
      >
        {valueString}
      </pre>
      {editing && preRef.current ? (
        <ModalInput
          element={preRef.current}
          value={valueString}
          onChange={onChangeInput}
          onCancel={onCancelInput}
        />
      ) : null}
    </div>
  )
}

export default PrimitiveView
