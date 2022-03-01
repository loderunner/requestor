import { intercepts } from './intercept'
import { pushRequest } from './request'

import type { Request } from './request'
import type { Protocol } from 'devtools-protocol'

type TargetInfo = chrome.debugger.TargetInfo
type Debuggee = chrome.debugger.Debuggee
export type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent

export const headersToEntries = (
  headers: Protocol.Network.Headers
): Protocol.Fetch.HeaderEntry[] =>
  Object.entries(headers).map(([name, value]) => ({
    name,
    value,
  }))

export const entriesToHeaders = (
  entries: Protocol.Fetch.HeaderEntry[]
): Protocol.Network.Headers =>
  Object.fromEntries(entries.map(({ name, value }) => [name, value]))

let pausedFlag = false
export const paused = () => pausedFlag
export const pause = () => (pausedFlag = true)
export const unpause = () => (pausedFlag = false)

const onRequestEvent = (event: RequestPausedEvent, target: Debuggee) => {
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
        pushRequest({
          id: event.requestId,
          interceptResponse: inter.interceptResponse,
          stage: 'Request',
          ...req,
        })
        return // return to avoid double capture
      }
    }
  }

  // Continue request if no match
  chrome.debugger.sendCommand(target, 'Fetch.continueRequest', {
    requestId: event.requestId,
  })
}

const onResponseEvent = async (event: RequestPausedEvent, target: Debuggee) => {
  if (event.responseErrorReason) {
    const params: Protocol.Fetch.FailRequestRequest = {
      requestId: event.requestId,
      errorReason: event.responseErrorReason,
    }
    chrome.debugger.sendCommand(target, 'Fetch.failRequest', params)
    return
  }

  const req = event.request
  const params: Protocol.Fetch.GetResponseBodyRequest = {
    requestId: event.requestId,
  }
  const res = (await chrome.debugger.sendCommand(
    target,
    'Fetch.getResponseBody',
    params
  )) as Protocol.Fetch.GetResponseBodyResponse
  const body = res.base64Encoded ? window.atob(res.body) : res.body
  pushRequest({
    id: event.requestId,
    interceptResponse: true,
    stage: 'Response',
    ...req,
    headers: entriesToHeaders(event.responseHeaders ?? []),
    statusCode: event.responseStatusCode,
    statusText:
      event.responseStatusText !== '' ? event.responseStatusText : undefined,
    postData: body,
    hasPostData: body?.length > 0 ?? false,
  })
}

const onDebuggerEvent = (
  target: Debuggee,
  method: string,
  params?: unknown
) => {
  if (method === 'Fetch.requestPaused') {
    const event: RequestPausedEvent = params as RequestPausedEvent

    if (event.responseStatusCode || event.responseErrorReason) {
      onResponseEvent(event, target)
    } else {
      onRequestEvent(event, target)
    }
  }
}

let debuggee: chrome.debugger.Debuggee | undefined

export const listen = async () => {
  if (debuggee !== undefined) {
    return
  }

  const targets = await chrome.debugger.getTargets()
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

const sendRequestCommand = async (
  method: string,
  commandParams:
    | Protocol.Fetch.ContinueRequestRequest
    | Protocol.Fetch.FailRequestRequest
    | Protocol.Fetch.FulfillRequestRequest
) => {
  if (debuggee === undefined) {
    throw new Error('Debugger not connected.\nDid you call listen() ?')
  }

  try {
    await chrome.debugger.sendCommand(debuggee, method, commandParams)
  } catch (err) {
    let e = err as Error
    try {
      const jsonErr = JSON.parse((err as Error).message)
      e = new Error(jsonErr.message)
    } catch (parseErr) {
      // Fallthrough on JSON parse error
    }
    throw e
  }
}

export const continueRequest = async (request: Request) => {
  if (request.stage !== 'Request') {
    throw new Error(`cannot continue request at the ${request.stage} stage`)
  }
  const method = 'Fetch.continueRequest'
  const commandParams: Protocol.Fetch.ContinueRequestRequest = {
    requestId: request.id,
    interceptResponse: request.interceptResponse,
    url: request.url,
    method: request.method,
    headers: headersToEntries(request.headers),
    postData: request.postData && window.btoa(request.postData),
  }
  return sendRequestCommand(method, commandParams)
}

export const failRequest = async (requestId: string) => {
  const method = 'Fetch.failRequest'
  const commandParams: Protocol.Fetch.FailRequestRequest = {
    requestId,
    errorReason: 'Aborted',
  }
  return sendRequestCommand(method, commandParams)
}

export const fulfillRequest = async (response: Request) => {
  const method = 'Fetch.fulfillRequest'

  const commandParams: Protocol.Fetch.FulfillRequestRequest = {
    requestId: response.id,
    responseCode: response.statusCode as number,
    responsePhrase: response.statusText as string,
    responseHeaders: headersToEntries(response.headers),
    body: response.postData && window.btoa(response.postData),
  }
  return sendRequestCommand(method, commandParams)
}
