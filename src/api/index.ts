import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request

export interface Message {
  type: string
}

export interface RequestMessage extends Message {
  type: 'request'
  request: Request
}
