import type Protocol from 'devtools-protocol'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')

type TargetInfo = chrome.debugger.TargetInfo
type Debuggee = chrome.debugger.Debuggee
type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent

const getTargets = async () => {
  return new Promise<TargetInfo[]>((resolve) =>
    chrome.debugger.getTargets((targets) => resolve(targets))
  )
}

const onDebuggerEvent = (
  target: Debuggee,
  method: string,
  params?: unknown
) => {
  console.log('debugger event', method, params)
  if (method === 'Fetch.requestPaused') {
    const event: RequestPausedEvent = params as RequestPausedEvent
    const d = new Date()
    console.log(
      `${d.toISOString()} - ${event.request.method} ${event.request.url}`
    )
    chrome.debugger.sendCommand(target, 'Fetch.continueRequest', {
      requestId: event.requestId,
    })
  }
}

let debuggee: chrome.debugger.Debuggee

const initDebugger = async () => {
  const targets = await getTargets()
  for (const t of targets) {
    if (t.tabId === chrome.devtools.inspectedWindow.tabId) {
      debuggee = { targetId: t.id }
      if (t.attached) {
        await chrome.debugger.attach(debuggee, '1.3')
      }
      chrome.debugger.onEvent.addListener(onDebuggerEvent)
      await chrome.debugger.sendCommand(debuggee, 'Fetch.enable', {})
    }
  }
}
console.log(`${new Date().toISOString()} startup backup script`)

window.addEventListener('beforeunload', () => {
  chrome.debugger.sendCommand(debuggee, 'Fetch.disable', {})
  chrome.debugger.onEvent.removeListener(onDebuggerEvent)
  chrome.debugger.detach(debuggee)
})

initDebugger()
