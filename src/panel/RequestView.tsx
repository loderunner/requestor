import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useRequest } from '@/interceptor/hooks'

import RequestBody from './RequestBody'
import RequestDetails from './RequestDetails'

interface Props {
  requestId: string
}

type Tab = 'headers' | 'body'

const enabledButtonClassName =
  'text-base rounded py-2 px-4 font-medium border hover:bg-gray-300 active:bg-gray-400'
const disabledButtonClassName =
  'text-base rounded py-2 px-4 font-medium border bg-blue-50'

const RequestView = ({ requestId }: Props) => {
  const { request, updateRequest } = useRequest(requestId)
  const [tab, setTab] = useState<Tab>('headers')

  useEffect(() => {
    setTab('headers')
  }, [requestId])

  const content = useMemo(
    () => (
      <>
        <RequestDetails
          className={tab === 'headers' ? '' : 'hidden'}
          requestId={requestId}
        />
        <RequestBody
          className={tab === 'body' ? '' : 'hidden'}
          requestId={requestId}
        />
      </>
    ),
    [tab, requestId]
  )

  const buttons = useMemo(() => {
    return (
      <>
        <button
          className={
            tab === 'headers' ? disabledButtonClassName : enabledButtonClassName
          }
          disabled={tab === 'headers'}
          onClick={() => setTab('headers')}
        >
          Headers
        </button>
        <button
          className={
            tab === 'body' ? disabledButtonClassName : enabledButtonClassName
          }
          disabled={tab === 'body'}
          onClick={() => setTab('body')}
        >
          Body
        </button>
      </>
    )
  }, [tab])

  const onToggleInterceptResponse = useCallback(() => {
    updateRequest({ interceptResponse: !request.interceptResponse })
  }, [request.interceptResponse, updateRequest])

  return (
    <div className="max-w-5xl mx-24 my-8 px-8 pt-2">
      <div className="flex space-x-4 mb-4">{buttons}</div>
      <label className="mt-1 inline-flex items-center">
        <input
          type="checkbox"
          checked={request.interceptResponse}
          onChange={onToggleInterceptResponse}
        />
        <span className="ml-1 text-sm text-gray-700">Intercept response</span>
      </label>
      {content}
    </div>
  )
}

export default RequestView
