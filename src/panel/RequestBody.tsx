import * as React from 'react'

import type { Request } from '@/interceptor'

interface Props {
  request: Request
}

interface Props {
  request: Request
}

const RequestBody = ({ request }: Props) => {
  return (
    <div>
      <pre className="bg-slate-100 px-6 py-6 whitespace-pre-wrap break-all">
        {request.postData}
      </pre>
    </div>
  )
}

export default RequestBody
