import { clone } from 'lodash'
import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { useRequests } from '@/interceptor/hooks'

import List from './components/List'
import { useSelection } from './selection'

import type { Request } from '@/interceptor'
import type { SyntheticEvent } from 'react'

interface ItemProps {
  request: Request
}

const Item = ({ request }: ItemProps) => {
  const { selection, selectionType, setSelection } = useSelection()

  const onSelect = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      setSelection(clone(request))
    },
    [request]
  )

  const className = useMemo(() => {
    let className =
      'select-none overflow-hidden text-ellipsis whitespace-nowrap'
    if (selectionType !== 'request') {
      return className
    }
    const s = selection as Request
    if (s === request) {
      className += ' bg-blue-100'
    }
    return className
  }, [selection, request])

  return (
    <div className={className} role="listitem" onClick={onSelect}>
      <span>{request.url}</span>
    </div>
  )
}

interface Props {
  className?: string
}

const header = (
  <div className="flex select-none justify-between bg-slate-100 p-1 font-bold">
    Requests
  </div>
)

const RequestList = ({ className }: Props) => {
  const requests = useRequests()
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
