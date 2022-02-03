import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useCallback, useEffect, useReducer } from 'react'

import * as Requests from '../devtools/requests'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: Requests.Request[], req: Requests.Request) => [...requests, req],
    []
  )

  const cb = useCallback((message) => {
    if (message.type === 'pausedRequest') {
      pushRequest(message.payload.request)

      chrome.runtime.sendMessage({
        type: 'continue',
        payload: {
          requestId: message.payload.requestId,
          request: message.payload.request,
        },
      })
    }
  }, [])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(cb)
    return () => {
      chrome.runtime.onMessage.removeListener(cb)
    }
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
