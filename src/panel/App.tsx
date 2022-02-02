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
    Requests.listen()
    const unsubscribe = Requests.subscribe((req) => {
      pushRequest(req)
    })

    return () => {
      unsubscribe()
      Requests.unlisten()
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
