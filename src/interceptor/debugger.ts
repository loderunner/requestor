import { intercepts } from './intercept'
import { pushRequest } from './request'

import type { Request } from './request'
import type { Protocol } from 'devtools-protocol'

type TargetInfo = chrome.debugger.TargetInfo
type Debuggee = chrome.debugger.Debuggee
export type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent

let pausedFlag = false
export const paused = () => pausedFlag
export const pause = () => (pausedFlag = true)
export const unpause = () => (pausedFlag = false)

const onDebuggerEvent = (
  target: Debuggee,
  method: string,
  params?: unknown
) => {
  if (method === 'Fetch.requestPaused') {
    const event: RequestPausedEvent = params as RequestPausedEvent
    if (!pausedFlag) {
      for (const inter of intercepts) {
        // Ignore disabled intercept
        if (!inter.enabled) {
          continue
        }

        // Ignore empty intercepts
        if (inter.pattern === undefined || inter.pattern === '') {
          continue
        }

        // Dispatch event if the intercept matches
        const req = event.request
        let match = false
        if (inter.regexp) {
          let re: RegExp
          try {
            re = new RegExp(inter.pattern, 'i')
          } catch (error) {
            continue
          }
          match = re.test(req.url)
        } else {
          match = req.url.includes(inter.pattern)
        }
        if (match) {
          pushRequest({ id: event.requestId, ...req })
          return // return to avoid double capture
        }
      }
    }

    // Continue request is no match
    chrome.debugger.sendCommand(target, 'Fetch.continueRequest', {
      requestId: event.requestId,
    })
  }
}

let debuggee: chrome.debugger.Debuggee | undefined

const getTargets = async () => {
  return new Promise<TargetInfo[]>((resolve) =>
    chrome.debugger.getTargets((targets) => resolve(targets))
  )
}

export const listen = async () => {
  if (debuggee !== undefined) {
    return
  }

  const targets = await getTargets()
  const target = targets.find(
    (t) => t.tabId === chrome.devtools.inspectedWindow.tabId
  )

  if (target === undefined) {
    throw new Error("Could not subscribe to inspected window's requests")
  }

  debuggee = { targetId: target.id }
  await chrome.debugger.attach(debuggee, '1.3')
  chrome.debugger.onEvent.addListener(onDebuggerEvent)
  await chrome.debugger.sendCommand(debuggee, 'Fetch.enable', {})
}

export const unlisten = () => {
  if (debuggee === undefined) {
    return
  }

  chrome.debugger.sendCommand(debuggee, 'Fetch.disable', {})
  chrome.debugger.onEvent.removeListener(onDebuggerEvent)
  chrome.debugger.detach(debuggee)
  debuggee = undefined
}

const continueOrFailRequest = async (
  requestId: string,
  method: string,
  commandParams:
    | Protocol.Fetch.ContinueRequestRequest
    | Protocol.Fetch.FailRequestRequest
) => {
  if (debuggee === undefined) {
    throw new Error('Debugger not connected.\nDid you call listen() ?')
  }

  try {
    await chrome.debugger.sendCommand(debuggee, method, commandParams)
  } catch (err) {
    // Don't throw on Invalid ID error
    try {
      const jsonErr = JSON.parse((err as Error).message)
      if (jsonErr.code === -32602) {
        return
      }
    } catch (jsonErr) {
      // Fallthrough on JSON parse error
    }
    throw err
  }
}

export const continueRequest = async (request: Request) => {
  const method = 'Fetch.continueRequest'
  const commandParams: Protocol.Fetch.ContinueRequestRequest = {
    requestId: request.id,
    url: request.url,
    method: request.method,
    headers: Object.entries(request.headers).map(([name, value]) => ({
      name,
      value,
    })),
    postData: request.postData && window.btoa(request.postData),
  }
  return continueOrFailRequest(request.id, method, commandParams)
}

export const failRequest = async (requestId: string) => {
  const method = 'Fetch.failRequest'
  const commandParams: Protocol.Fetch.FailRequestRequest = {
    requestId,
    errorReason: 'Aborted',
  }
  return continueOrFailRequest(requestId, method, commandParams)
}
