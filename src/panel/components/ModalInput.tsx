import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { CSSProperties, ChangeEvent, KeyboardEvent } from 'react'

interface Props {
  element: HTMLElement
  value: string
  onChange: (value: string) => void
  onCancel: () => void
}

const ModalInput = ({ element, value, onChange, onCancel }: Props) => {
  const [inputValue, setInputValue] = useState(value)
  const [validationError, setValidationError] = useState<Error | null>(null)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  const onChangeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setValidationError(null)
  }, [])

  const onChangeSafe = useCallback(
    (value: string) => {
      try {
        onChange(value)
      } catch (err) {
        setValidationError(err as Error)
      }
    },
    [onChange]
  )

  const onBlur = useCallback(
    () => onChangeSafe(inputValue),
    [inputValue, onChangeSafe]
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          onChangeSafe(inputValue)
          break
        case 'Escape':
          onCancel()
          break
        default:
          return
      }
      e.stopPropagation()
    },
    [inputValue, onCancel, onChangeSafe]
  )

  // Inline styles from element properties
  const inlineStyles = useMemo((): CSSProperties => {
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      marginLeft: `calc(-0.25rem - ${style.paddingLeft})`,
      marginTop: `calc(-0.25rem - ${style.paddingTop})`,
      padding: '0.25rem',
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `calc(${rect.width}px + 2 * 0.25rem)`,
      minWidth: '120px',
    }
  }, [element])

  return (
    <>
      <input
        className={`fixed ${validationError !== null ? 'bg-rose-100' : ''}`}
        style={inlineStyles}
        type="text"
        value={inputValue}
        onChange={onChangeInput}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        ref={ref}
      />
      {validationError !== null ? (
        <span className="absolute pt-0.5 text-xs bg-rose-100 rounded-b-sm text-rose-500">
          {validationError.message}
        </span>
      ) : null}
    </>
  )
}

export default ModalInput
