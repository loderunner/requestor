import * as React from 'react'

import * as Intercept from '@/intercept'

interface Props {
  className?: string
  requests: Intercept.Request[]
}

const RequestList = ({ className, requests }: Props) => (
  <div className={`flex flex-col ${className}`}>
    <div className="font-bold bg-slate-100">Requests</div>
    <div className="overflow-y-auto">
      {requests.map((req, i) => (
        <div
          key={i}
          className="whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <span>{req.url}</span>
        </div>
      ))}
    </div>
  </div>
)

export default RequestList
