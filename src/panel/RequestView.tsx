import * as React from 'react'

import { useRequest } from '@/interceptor/hooks'

interface Props {
  requestId: string
}

const RequestView = ({ requestId }: Props) => {
  const request = useRequest(requestId)
  return (
    <div className="text-6xl font-medium">{`${request.method} ${request.url}`}</div>
  )
}

export default RequestView
