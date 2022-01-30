import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useReducer } from 'react'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: string[], req: string) => [...requests, req],
    []
  )

  return (
    <>
      <Box sx={{ typography: 'h1' }}>Hello World!</Box>
      <Stack>
        {requests.map((req, i) => (
          <div key={i}>{req}</div>
        ))}
      </Stack>
    </>
  )
}

export default App
