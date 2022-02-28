import * as Debugger from './debugger'

import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request & {
  id: string
  interceptResponse: boolean
  stage: Protocol.Fetch.RequestStage

  // Response properties
  statusCode?: number
  statusText?: string
}

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
    current.url = request.url ?? current.url
    current.statusCode = request.statusCode ?? current.statusCode
    current.statusText = request.statusText ?? current.statusText
    current.method = request.method ?? current.method
    current.headers = request.headers ?? current.headers
    current.postData = request.postData ?? current.postData
    current.hasPostData = current.postData !== undefined
    current.interceptResponse =
      request.interceptResponse ?? current.interceptResponse
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

export const fulfillRequest = async (requestId: string) => {
  const req = requests.find((req) => req.id === requestId)
  if (req !== undefined) {
    await Debugger.fulfillRequest(req)
  }

  // Search again because may have changed concurrently
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
