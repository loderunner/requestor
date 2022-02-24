import * as Debugger from './debugger'

import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request & { id: string }

export const requests: Request[] = []

class RequestEvent extends Event {
  readonly request: Request
  constructor(request: Request) {
    super('request')
    this.request = request
  }
}

const requestEventTarget = new EventTarget()

export const pushRequest = (request: Request) => {
  requests.push(request)
  requestEventTarget.dispatchEvent(new RequestEvent(request))
}

export const updateRequest = (
  id: string,
  request: Partial<Request>
): Readonly<Request> | undefined => {
  const current = requests.find((req) => req.id === id)
  if (current !== undefined) {
    current.postData = request.postData ?? current.postData
    current.hasPostData = current.postData !== undefined
  }
  return current
}

export const continueRequest = async (requestId: string) => {
  const req = requests.find((req) => req.id === requestId)
  if (req !== undefined) {
    await Debugger.continueRequest(req)
  }

  // Search again because may have changed concurrently
  const i = requests.findIndex((req) => req.id === requestId)
  if (i !== -1) {
    requests.splice(i, 1)
  }
}

export const failRequest = async (requestId: string) => {
  await Debugger.failRequest(requestId)
  const i = requests.findIndex((req) => req.id === requestId)
  if (i !== -1) {
    requests.splice(i, 1)
  }
}

export type RequestEventListener = (req: Request) => void

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
