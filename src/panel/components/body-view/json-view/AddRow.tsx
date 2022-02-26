import * as React from 'react'
import { useMemo, useState } from 'react'

import { Clear as ClearIcon } from '@/icons'

import KeyView from './KeyView'
import PrimitiveView from './PrimitiveView'

import type { JSONValue } from '../JSON'

interface Props {
  depth: number
  keyEditable: boolean
  onAdd?: (key: string, value: JSONValue) => void
  onCancel?: () => void
}

const AddRow = ({ depth, keyEditable, onAdd, onCancel }: Props) => {
  const [step, setStep] = useState<'key' | 'value'>(
    keyEditable ? 'key' : 'value'
  )
  const [key, setKey] = useState('')

  const keyView = useMemo(
    () => (
      <KeyView
        name={key}
        editable={keyEditable}
        editingInitial={step === 'key'}
        onChange={(k) => {
          setKey(k)
          setStep('value')
        }}
        onCancel={onCancel}
      />
    ),
    [key, keyEditable, onCancel, step]
  )

  const valueView = useMemo(
    () => (
      <PrimitiveView
        editingInitial={step === 'value'}
        onChange={(value) => {
          if (onAdd !== undefined) {
            onAdd(key, value)
          }
        }}
        onCancel={onCancel}
      />
    ),
    [key, onAdd, onCancel, step]
  )

  return (
    <div
      className="mt-1 flex items-center space-x-1"
      style={{ marginLeft: `${depth}rem` }}
    >
      {/* Placeholder icon for alignment */}
      <ClearIcon className="opacity-0 fill-white" />
      {keyView}
      {step === 'value' ? valueView : null}
    </div>
  )
}

export default AddRow
