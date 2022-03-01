import * as ContentType from 'content-type'
import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { useRequest } from '@/interceptor/hooks'

import JSONBodyView from './components/body-view/JSON'
import PlainTextBodyView from './components/body-view/PlainText'

interface Props {
  className?: string
  requestId: string
}

const RequestBody = ({ requestId, className = '' }: Props) => {
  const { request, updateRequest } = useRequest(requestId)
  const contentType = useMemo(() => {
    try {
      const contentTypeHeader = Object.entries(request.headers).find(
        ([headerName]) => headerName.toLowerCase() === 'content-type'
      )
      if (contentTypeHeader === undefined) {
        return ''
      }

      const contentType = ContentType.parse(contentTypeHeader[1])
      return contentType.type
    } catch (err) {
      return ''
    }
  }, [request])

  const onChangeBody = useCallback(
    (body?: string) => updateRequest({ postData: body }),
    [updateRequest]
  )

  const bodyView = useMemo(() => {
    if (request.postData) {
      try {
        if (
          contentType === 'application/json' ||
          contentType === 'text/plain'
        ) {
          JSON.parse(request.postData)
          return (
            <JSONBodyView
              key={request.id}
              jsonData={request.postData}
              onChange={onChangeBody}
            />
          )
        }
      } catch (err) {
        // ignore error parsing JSON
      }
    }
    return (
      <PlainTextBodyView
        key={request.id}
        data={request.postData}
        onChange={onChangeBody}
      />
    )
  }, [contentType, onChangeBody, request.id, request.postData])

  return (
    <div className={`flex flex-col justify-items-stretch ${className}`}>
      {bodyView}
    </div>
  )
}

export default RequestBody
