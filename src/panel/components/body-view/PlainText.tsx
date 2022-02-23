import * as React from 'react'
import { useCallback, useLayoutEffect, useState } from 'react'

interface Props {
  data?: string
  onChange?: (body?: string) => void
}

const PlainTextBodyView = ({ data, onChange }: Props) => {
  const [bodyData, setBodyData] = useState(data)

  useLayoutEffect(() => setBodyData(data), [data])

  const onInput = useCallback(
    (e: React.SyntheticEvent<HTMLPreElement, FocusEvent>) => {
      setBodyData(e.currentTarget.textContent ?? undefined)
      if (onChange !== undefined) {
        onChange(e.currentTarget.textContent ?? undefined)
      }
    },
    [onChange]
  )

  console.log('PlainTextBodyView render', { data, bodyData })

  return React.useMemo(
    () => (
      <pre
        className="bg-slate-100 px-6 py-6 whitespace-pre-wrap break-all"
        contentEditable="true"
        suppressContentEditableWarning
        role="textbox"
        onBlur={onInput}
      >
        {bodyData}
      </pre>
    ),
    [bodyData, onInput]
  )
}

export default PlainTextBodyView
