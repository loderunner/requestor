import * as React from 'react'

interface Props {
  className?: string
}

const InterceptList = ({ className }: Props) => (
  <div className={`flex flex-col ${className}`}>
    <div className="font-bold bg-slate-100">Intercepts</div>
    <div className="overflow-y-auto">
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        <span>Lorem</span>
      </div>
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        <span>Ipsum</span>
      </div>
    </div>
  </div>
)

export default InterceptList
