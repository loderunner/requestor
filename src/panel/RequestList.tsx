import * as React from 'react'
import { useMemo } from 'react'

import * as Interceptor from '@/interceptor'

import List from './components/List'

interface ItemProps {
  request: Interceptor.Request
}

const Item = ({ request }: ItemProps) => (
  <div className="select-none overflow-hidden text-ellipsis whitespace-nowrap">
    <span>{request.url}</span>
  </div>
)

interface Props {
  className?: string
  requests: Interceptor.Request[]
}

const RequestList = ({ className, requests }: Props) => {
  const header = useMemo(
    () => (
      <div className="flex select-none justify-between bg-slate-100 p-1 font-bold">
        Requests
      </div>
    ),
    []
  )

  const items = useMemo(
    () => requests.map((req, i) => <Item key={i} request={req} />),
    [requests]
  )

  return (
    <List
      id="request-list"
      className={className}
      header={header}
      items={items}
    />
  )
}

export default RequestList
