import type { Protocol } from 'devtools-protocol'

type Port = chrome.runtime.Port
type Request = Protocol.Network.Request

const onMessage = (message: any) => console.log(message)

const connections = new Set<Port>()
const onConnect = (port: Port) => {
  connections.add(port)
  port.onDisconnect.addListener(() => connections.delete(port))
  port.onMessage.addListener(onMessage)
}

export const listen = () => {
  chrome.runtime.onConnect.addListener(onConnect)
}

export const shutdown = () => {
  for (const conn of connections) {
    conn.onMessage.removeListener(onMessage)
  }
  chrome.runtime.onConnect.removeListener(onConnect)
}

export const sendRequest = (request: Request) => {
  for (const conn of connections) {
    conn.postMessage({ type: 'request', request })
  }
}
