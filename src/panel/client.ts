import type { Protocol } from 'devtools-protocol'

export type Request = Protocol.Network.Request

interface Message {
  type: string
}

interface RequestMessage extends Message {
  type: 'request'
  request: Request
}

const conn = chrome.runtime.connect({ name: 'devtools-page' })

type RequestEventListener = (request: Request) => void

export const subscribe = (listener: RequestEventListener) => {
  const onMessage = (message: Message) => {
    if (message.type === 'request') {
      const requestMessage = message as RequestMessage
      listener(requestMessage.request)
    }
  }
  conn.onMessage.addListener(onMessage)

  const unsubscribe = () => conn.onMessage.removeListener(onMessage)
  return unsubscribe
}
