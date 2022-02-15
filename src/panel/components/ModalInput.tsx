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
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
    ref.current?.select()
  }, [])

  const onChangeInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value),
    []
  )

  const onBlur = useCallback(() => onChange(inputValue), [inputValue])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Enter':
          onChange(inputValue)
          break
        case 'Escape':
          onCancel()
          break
        default:
          return
      }
      e.stopPropagation()
    },
    [inputValue]
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
    }
  }, [element])

  return (
    <input
      className="fixed"
      style={inlineStyles}
      type="text"
      value={inputValue}
      onChange={onChangeInput}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      ref={ref}
    />
  )
}

export default ModalInput
