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

export const continueRequest = async (requestId: string) => {
  await Debugger.continueRequest(requestId)
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
