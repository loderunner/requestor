import type * as api from '@api'

const conn = chrome.runtime.connect({ name: 'devtools-page' })

type RequestEventListener = (request: api.Request) => void

export const subscribe = (listener: RequestEventListener) => {
  const onMessage = (message: api.Message) => {
    if (message.type === 'request') {
      const requestMessage = message as api.RequestMessage
      listener(requestMessage.request)
    }
  }
  conn.onMessage.addListener(onMessage)

  const unsubscribe = () => conn.onMessage.removeListener(onMessage)
  return unsubscribe
}
