import * as React from 'react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'

import ModalInput from '../../ModalInput'

import type { SyntheticEvent } from 'react'

interface Props {
  name: string
  editable: boolean
  editingInitial?: boolean
  onChange?: (name: string) => void
  onCancel?: () => void
}

const KeyView = ({
  name,
  editable,
  editingInitial = false,
  onChange,
  onCancel,
}: Props) => {
  const [editing, setEditing] = useState(false)
  const preRef = useRef(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => setEditing(editingInitial), [])

  const onDoubleClick = useCallback(
    (e: SyntheticEvent) => {
      if (!editable) {
        return
      }
      if (!preRef.current) {
        return
      }
      e.stopPropagation()
      setEditing(true)
    },
    [editable]
  )

  const onChangeInput = useCallback(
    (value) => {
      if (onChange !== undefined) {
        onChange(value)
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
