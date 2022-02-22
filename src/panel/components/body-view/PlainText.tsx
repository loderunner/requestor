import * as React from 'react'

interface Props {
  data?: string
}

const PlainTextBodyView = ({ data = '' }: Props) => (
  <pre className={`bg-slate-100 px-6 py-6 whitespace-pre-wrap break-all`}>
    {data}
  </pre>
)

export default PlainTextBodyView
