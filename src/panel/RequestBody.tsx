import * as ContentType from 'content-type'
import * as React from 'react'
import { useMemo } from 'react'

import { JSONBodyView } from './components/body-view/JSON'

import type { Request } from '@/interceptor'

interface Props {
  request: Request
}

interface Props {
  request: Request
}

const RequestBody = ({ request }: Props) => {
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

  if (request.postData) {
    try {
      if (contentType === 'application/json' || contentType === 'text/plain') {
        JSON.parse(request.postData)
      }
      return <JSONBodyView jsonData={request.postData} />
    } catch (err) {
      // ignore error parsing JSON
    }
  }

  return (
    <pre className="bg-slate-100 px-6 py-6 whitespace-pre-wrap break-all">
      {request.postData}
    </pre>
  )
}

export default RequestBody
