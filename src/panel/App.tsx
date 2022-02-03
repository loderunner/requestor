import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useEffect, useReducer } from 'react'

import * as Requests from './requests'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: Requests.Request[], req: Requests.Request) => [...requests, req],
    []
  )

  useEffect(() => {
    console.log('Init interceptor')
    const interceptor = Requests.createInterceptor()
    const { requests$, continue$ } = interceptor

    const subscription = requests$.subscribe((args) => {
      if (args === null) {
        return
      }

      const [, , params] = args

      console.log('====== INTERCEPTED ======', params)

      if (params === undefined) {
        return
      }

      pushRequest(params.request)

      continue$.next({ requestId: params.requestId, request: params.request })
    })

    return subscription.unsubscribe
  }, [])

  return (
    <>
      <Box sx={{ typography: 'h1' }}>Hello World!</Box>
      <Stack>
        {requests.map((request, i) => (
          <div key={i}>
            {request.method} {request.url}
          </div>
        ))}
      </Stack>
    </>
  )
}

export default App
