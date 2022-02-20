import * as React from 'react'
import { useEffect, useState } from 'react'

import { useRequest } from '@/interceptor/hooks'

import RequestDetails from './RequestDetails'

interface Props {
  requestId: string
}

type Tab = 'headers' | 'body'

const RequestView = ({ requestId }: Props) => {
  const request = useRequest(requestId)

  return (
    <div className="max-w-5xl mx-24 mt-8 px-8 pt-2">
      <RequestDetails request={request} />
    </div>
  )
}

export default RequestView
