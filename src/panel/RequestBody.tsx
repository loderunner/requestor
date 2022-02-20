import * as React from 'react'

import type { Request } from '@/interceptor'

interface Props {
  request: Request
}

interface Props {
  request: Request
}

const RequestBody = ({ request }: Props) => {
  return <div>{request.postData}</div>
}

export default RequestBody
