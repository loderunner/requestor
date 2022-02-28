import * as React from 'react'
import { useCallback, useMemo } from 'react'

import {
  Eject as EjectIcon,
  MultipleStop as MultipleStopIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@/icons'
import { Request } from '@/interceptor'
import { useRequest, useRequests } from '@/interceptor/hooks'

import List from './components/List'
import { useSelection } from './selection'

import type { SyntheticEvent } from 'react'

interface ItemProps {
  requestId: string
}

const Item = ({ requestId }: ItemProps) => {
  const { request, continueRequest, failRequest } = useRequest(requestId)
  const { selection, selectionType, setSelection } = useSelection()

  const selected = useMemo(
    () =>
      selectionType === 'request' && (selection as Request).id === request.id,
    [request.id, selection, selectionType]
  )

  const onSelect = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      setSelection({ ...request })
    },
    [request, setSelection]
  )

  const bgColor = useMemo(() => {
    if (selected) {
      if (request.stage === 'Request') {
        return 'bg-blue-100'
      } else if (request.stage === 'Response') {
        const statusCode = request.statusCode ?? 0
        if (statusCode >= 200 && statusCode < 300) {
          return 'bg-lime-100'
        } else if (statusCode >= 300 && statusCode < 400) {
          return 'bg-indigo-100'
        } else if (statusCode >= 400 && statusCode < 500) {
          return 'bg-yellow-100'
        } else if (statusCode >= 500 && statusCode < 600) {
          return 'bg-red-100'
        }
      }
    }
    return ''
  }, [request.stage, request.statusCode, selected])

  const iconColor = useMemo(() => {
    if (request.stage === 'Response') {
      const statusCode = request.statusCode ?? 0
      if (statusCode >= 200 && statusCode < 300) {
        return 'fill-green-600'
      } else if (statusCode >= 300 && statusCode < 400) {
        return 'fill-indigo-600'
      } else if (statusCode >= 400 && statusCode < 500) {
        return 'fill-amber-600'
      } else if (statusCode >= 500 && statusCode < 600) {
        return 'fill-red-600'
      }
    }
    return ''
  }, [request.stage, request.statusCode])

  const onContinueOrFail = useCallback(
    async (e: SyntheticEvent, continueOrFail: 'continue' | 'fail') => {
      e.stopPropagation()
      const wasSelected =
        selectionType === 'request' && selection?.id === requestId
      if (wasSelected) {
        setSelection(null)
      }
      try {
        switch (continueOrFail) {
          case 'continue':
            await continueRequest()
            break
          case 'fail':
            await failRequest()
            break
        }
      } catch (err) {
        // re-select request if continueRequest failed
        if (wasSelected) {
          setSelection({ ...request })
        }
      }
    },
    [
      continueRequest,
      failRequest,
      request,
      requestId,
      selection?.id,
      selectionType,
      setSelection,
    ]
  )

  const onContinue = useCallback(
    (e: SyntheticEvent) => onContinueOrFail(e, 'continue'),
    [onContinueOrFail]
  )
  const onFail = useCallback(
    (e: SyntheticEvent) => onContinueOrFail(e, 'fail'),
    [onContinueOrFail]
  )

  return (
    <div
      className={`px-1 flex select-none overflow-hidden ${bgColor}`}
      role="listitem"
      onClick={onSelect}
    >
      {request.stage === 'Response' ? (
        <span className="self-stretch">
          <MultipleStopIcon className={`h-full w-auto ${iconColor}`} />
        </span>
      ) : null}
      <span className="flex-auto mr-1 overflow-hidden text-ellipsis whitespace-nowrap">
        {request.url}
      </span>
      <button className="self-stretch" title="Cancel request" onClick={onFail}>
        <StopIcon className="h-full w-auto" />
      </button>
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

const RequestList = ({ className = '' }: Props) => {
  const { requests, continueAllRequests } = useRequests()
  const items = useMemo(
    () => requests.map((req, i) => <Item key={i} requestId={req.id} />),
    [requests]
  )

  const header = useMemo(
    () => (
      <div className="p-1 flex space-x-1 justify-between select-none bg-slate-100">
        <span className="font-bold flex-auto">Requests</span>
        <button
          className="self-stretch"
          title="Continue all requests"
          onClick={continueAllRequests}
        >
          <EjectIcon className="h-full w-auto rotate-90" />
        </button>
      </div>
    ),
    [continueAllRequests]
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
