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

class RequestEventTarget {
  private callbacks = new Map<RequestEventListener, EventListener>()
  private eventTarget = new EventTarget()

  addListener(listener: RequestEventListener): void {
    const callback = (event: Event) => {
      const requestEvent = event as RequestEvent
      listener(requestEvent.request)
    }
    this.callbacks.set(listener, callback)
    this.eventTarget.addEventListener('request', callback)
  }

  removeListener(listener: RequestEventListener): void {
    const callback = this.callbacks.get(listener)
    if (callback !== undefined) {
      this.eventTarget.removeEventListener('request', callback)
    }
  }

  dispatchEvent(request: Request): boolean {
    return this.eventTarget.dispatchEvent(new RequestEvent(request))
  }
}

export const onRequest = new RequestEventTarget()

const onDebuggerEvent = (
  target: Debuggee,
  method: string,
  params?: unknown
) => {
  if (method === 'Fetch.requestPaused') {
    const event: RequestPausedEvent = params as RequestPausedEvent
    onRequest.dispatchEvent(event.request)
    chrome.debugger.sendCommand(target, 'Fetch.continueRequest', {
      requestId: event.requestId,
    })
  }
}

let debuggee: chrome.debugger.Debuggee

const getTargets = async () => {
  return new Promise<TargetInfo[]>((resolve) =>
    chrome.debugger.getTargets((targets) => resolve(targets))
  )
}

export const listen = async () => {
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
  chrome.debugger.sendCommand(debuggee, 'Fetch.disable', {})
  chrome.debugger.onEvent.removeListener(onDebuggerEvent)
  chrome.debugger.detach(debuggee)
}
