import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request

export interface Message {
  type: string
}

export const RequestEventType = 'request'
export interface RequestEvent extends Message {
  type: typeof RequestEventType
  request: Request
}
