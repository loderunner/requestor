import * as React from 'react'

import * as Intercept from '@/intercept'

import List from './components/List'

interface Props {
  className?: string
  requests: Intercept.Request[]
}

const RequestList = ({ className, requests }: Props) => {
  const items = requests.map((req, i) => <RequestItem key={i} request={req} />)
  return <List className={className} header="Requests" items={items} />
}

interface ItemProps {
  request: Intercept.Request
}

const RequestItem = ({ request }: ItemProps) => (
  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
    <span>{request.url}</span>
  </div>
)

export default RequestList
