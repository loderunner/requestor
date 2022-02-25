import * as React from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'

import ModalInput from '../../ModalInput'

import type { SyntheticEvent } from 'react'

interface Props {
  name: string
  editable: boolean
  onChange?: (name: string) => void
}

const KeyView = ({ name, editable, onChange }: Props) => {
  const [editing, setEditing] = useState(false)
  const preRef = useRef(null)

  const onDoubleClick = useMemo(() => {
    if (!editable) {
      return
    }
    return (e: SyntheticEvent) => {
      if (!preRef.current) {
        return
      }
      e.stopPropagation()
      setEditing(true)
    }
  }, [editable])

  const onChangeInput = useCallback(
    (value) => {
      if (onChange !== undefined) {
        onChange(value)
      }
      setEditing(false)
    },
    [onChange]
  )

  const onCancelInput = useCallback(() => setEditing(false), [])

  return (
    <>
      <pre
        className="text-amber-700"
        onDoubleClick={onDoubleClick}
        ref={preRef}
      >
        {name}:
      </pre>{' '}
      {editing && preRef.current ? (
        <ModalInput
          element={preRef.current}
          value={name}
          onChange={onChangeInput}
          onCancel={onCancelInput}
        />
      ) : null}
    </>
  )
}

export default KeyView
