import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useReducer } from 'react'

const App = () => {
  const [requests] = useReducer(
    (requests: string[], req: string) => [...requests, req],
    []
  )

  return (
    <>
      <Box sx={{ typography: 'h4' }}>
        Undock devtools into separate window and press cmd+option+i
      </Box>
      <Stack>
        {requests.map((req, i) => (
          <div key={i}>{req}</div>
        ))}
      </Stack>
    </>
  )
}

export default App
