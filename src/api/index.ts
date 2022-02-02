import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request

export interface Message {
  type: 'request' | 'response' | 'event'
}

export interface RequestMessage extends Message {
  type: 'request'
}

export interface ResponseMessage extends Message {
  type: 'response'
}

export interface EventMessage extends Message {
  type: 'event'
  eventType: string
}

export const RequestEventType = 'request'

export interface RequestEventMessage extends EventMessage {
  eventType: typeof RequestEventType
  request: Request
}
