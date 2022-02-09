import * as React from 'react'
import { useMemo } from 'react'

import * as Intercept from '@/intercept'

import List from './components/List'

interface ItemProps {
  request: Intercept.Request
}

const Item = ({ request }: ItemProps) => (
  <div className="select-none whitespace-nowrap overflow-hidden text-ellipsis">
    <span>{request.url}</span>
  </div>
)

interface Props {
  className?: string
  requests: Intercept.Request[]
}

const RequestList = ({ className, requests }: Props) => {
  const header = useMemo(
    () => (
      <div className="p-1 flex justify-between font-bold select-none bg-slate-100">
        Requests
      </div>
    ),
    []
  )

  const items = useMemo(
    () => requests.map((req, i) => <Item key={i} request={req} />),
    [requests]
  )

  return <List className={className} header={header} items={items} />
}

export default RequestList
