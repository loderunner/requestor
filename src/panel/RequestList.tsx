import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { PlayArrow as PlayArrowIcon } from '@/icons'
import { useRequest, useRequests } from '@/interceptor/hooks'

import List from './components/List'
import { useSelection } from './selection'

import type { Request } from '@/interceptor'
import type { SyntheticEvent } from 'react'

interface ItemProps {
  requestId: string
}

const Item = ({ requestId }: ItemProps) => {
  const { request, continueRequest } = useRequest(requestId)
  const { selection, selectionType, setSelection } = useSelection()

  const onSelect = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      setSelection({ ...request })
    },
    [request, setSelection]
  )

  const className = useMemo(() => {
    let className = 'px-1 flex space-x-1 select-none overflow-hidden'
    if (selectionType !== 'request') {
      return className
    }
    const s = selection as Request
    if (s.id === request.id) {
      className += ' bg-blue-100'
    }
    return className
  }, [selectionType, selection, request.id])

  const onContinue = useCallback(
    async (e: SyntheticEvent) => {
      e.stopPropagation()
      const wasSelected =
        selectionType === 'request' && selection?.id === requestId
      if (wasSelected) {
        setSelection(null)
      }
      try {
        await continueRequest()
      } catch (err) {
        // re-select request if continueRequest failed
        if (wasSelected) {
          setSelection({ ...request })
        }
      }
    },
    [
      continueRequest,
      request,
      requestId,
      selection?.id,
      selectionType,
      setSelection,
    ]
  )

  return (
    <div className={className} role="listitem" onClick={onSelect}>
      <span className="flex-auto overflow-hidden text-ellipsis whitespace-nowrap">
        {request.url}
      </span>
      <button
        className="self-stretch"
        title="Continue request"
        onClick={onContinue}
      >
        <PlayArrowIcon className="h-full w-auto" />
      </button>
    </div>
  )
}

interface Props {
  className?: string
}

const header = (
  <div className="p-1 flex select-none justify-between bg-slate-100 font-bold">
    Requests
  </div>
)

const RequestList = ({ className }: Props) => {
  const requests = useRequests()
  const items = useMemo(
    () => requests.map((req, i) => <Item key={i} requestId={req.id} />),
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
