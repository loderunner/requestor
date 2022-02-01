import type * as api from '../api'

type Port = chrome.runtime.Port

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

export const sendRequest = (request: api.Request) => {
  for (const conn of connections) {
    conn.postMessage({ type: 'request', request })
  }
}
