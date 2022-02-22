import * as React from 'react'

interface Props {
  data?: string
  onInput?: React.ReactEventHandler
}

const PlainTextBodyView = ({ data = '', onInput }: Props) => (
  <pre
    className={`bg-slate-100 px-6 py-6 whitespace-pre-wrap break-all`}
    contentEditable="true"
    onInput={onInput}
  >
    {data}
  </pre>
)

export default PlainTextBodyView
