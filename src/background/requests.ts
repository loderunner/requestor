import type Protocol from 'devtools-protocol'

type TargetInfo = chrome.debugger.TargetInfo
type Debuggee = chrome.debugger.Debuggee
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent
export type Request = Protocol.Network.Request

class RequestEvent extends Event {
  readonly request: Request
  constructor(request: Request) {
    super('request')
    this.request = request
  }
}

type RequestEventListener = (req: Request) => void

const requestEventTarget = new EventTarget()

const onDebuggerEvent = (
  target: Debuggee,
  method: string,
  params?: unknown
) => {
  if (method === 'Fetch.requestPaused') {
    const event: RequestPausedEvent = params as RequestPausedEvent
    requestEventTarget.dispatchEvent(new RequestEvent(event.request))
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

export const subscribe = (listener: RequestEventListener) => {
  const callback = (event: Event) => {
    const requestEvent = event as RequestEvent
    listener(requestEvent.request)
  }

  requestEventTarget.addEventListener('request', callback)

  const unsubscribe = () => {
    requestEventTarget.removeEventListener('request', callback)
  }

  return unsubscribe
}
