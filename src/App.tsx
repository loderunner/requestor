import { Box, Stack } from '@mui/material'
import * as React from 'react'
import { useEffect, useReducer } from 'react'

import type Protocol from 'devtools-protocol'

type TargetInfo = chrome.debugger.TargetInfo
type Debuggee = chrome.debugger.Debuggee
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: string[], req: string) => [...requests, req],
    []
  )

  const onEvent = (target: Debuggee, method: string, params?: unknown) => {
    console.log('debugger event', method, params)
    if (method === 'Fetch.requestPaused') {
      const event: RequestPausedEvent = params as RequestPausedEvent
      const d = new Date()
      pushRequest(
        `${d.toISOString()} - ${event.request.method} ${event.request.url}`
      )
      chrome.debugger.sendCommand(target, 'Fetch.continueRequest', {
        requestId: event.requestId,
      })
    }
  }

  const getTargets = async () => {
    return new Promise<TargetInfo[]>((resolve) =>
      chrome.debugger.getTargets((targets) => resolve(targets))
    )
  }

  const initDebugger = async () => {
    const targets = await getTargets()
    for (const t of targets) {
      if (t.tabId === chrome.devtools.inspectedWindow.tabId) {
        const debuggee: chrome.debugger.Debuggee = { targetId: t.id }
        await chrome.debugger.attach(debuggee, '1.3')
        chrome.debugger.onEvent.addListener(onEvent)
        await chrome.debugger.sendCommand(debuggee, 'Fetch.enable', {})
      }
    }
  }

  useEffect(() => {
    initDebugger()
  }, [])

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
