import * as Rx from 'rxjs'

import type Protocol from 'devtools-protocol'

type TargetInfo = chrome.debugger.TargetInfo

export type Debuggee = chrome.debugger.Debuggee
export type Request = Protocol.Network.Request
export type RequestId = Protocol.Network.RequestId
export type RequestPausedEvent = Protocol.Fetch.RequestPausedEvent
export type PausedEvent = [
  debuggee: Debuggee,
  method: string,
  params?: RequestPausedEvent | undefined
]

export type InterceptorAPI = {
  requests$: Rx.Observable<PausedEvent | null>
  pause$: Rx.Subject<boolean>
  continue$: Rx.Subject<{ requestId: RequestId; request: Request }>
}

type DebuggerEventCallback = (
  source: Debuggee,
  method: string,
  params?: unknown | undefined
) => void

function addDebuggerListener(handler: DebuggerEventCallback) {
  chrome.debugger.onEvent.addListener(handler)
}

function removeDebuggerListener(handler: DebuggerEventCallback) {
  chrome.debugger.onEvent.removeListener(handler)
}

const debugger$ = Rx.fromEventPattern<PausedEvent>(
  addDebuggerListener,
  removeDebuggerListener
)

const getTargets = Rx.bindCallback(chrome.debugger.getTargets)
const attach = Rx.bindCallback(chrome.debugger.attach)
const detach = Rx.bindCallback(chrome.debugger.detach)
const send = Rx.bindCallback(chrome.debugger.sendCommand)

function findInspectedTarget(targets: TargetInfo[]) {
  const target = targets.find(
    (t) => t.tabId === chrome.devtools.inspectedWindow.tabId
  )
  if (target === undefined) {
    throw new Error("Could not subscribe to inspected window's requests")
  }
  return target
}

function toDebuggee(target: TargetInfo): Debuggee {
  return { targetId: target.id }
}

export function createInterceptor(): InterceptorAPI {
  const debuggee$ = getTargets().pipe(
    Rx.map(findInspectedTarget),
    Rx.map(toDebuggee),
    Rx.shareReplay(1)
  )

  const continue$ = new Rx.Subject<{ requestId: RequestId; request: Request }>()
  const pause$ = new Rx.BehaviorSubject<boolean>(true)

  const attach$ = debuggee$.pipe(
    Rx.switchMap((debuggee) => attach(debuggee, '1.3')),
    Rx.mapTo(null)
  )

  const detach$ = debuggee$.pipe(
    Rx.switchMap((debuggee) => detach(debuggee)),
    Rx.mapTo(null)
  )

  const listen$ = debuggee$.pipe(
    Rx.switchMap((debuggee) =>
      Rx.merge(
        pause$.pipe(
          Rx.switchMap((pause) =>
            pause
              ? send(debuggee, 'Fetch.enable', {})
              : send(debuggee, 'Fetch.disable', {})
          ),
          Rx.mapTo(null)
        ),
        continue$.pipe(
          Rx.switchMap(({ requestId }) =>
            send(debuggee, 'Fetch.continueRequest', { requestId })
          ),
          Rx.mapTo(null)
        ),
        debugger$.pipe(
          Rx.filter(([, method]) => method === 'Fetch.requestPaused')
        )
      )
    )
  )

  const requests$ = Rx.concat(attach$, listen$, detach$)

  return {
    requests$,
    pause$,
    continue$,
  }
}
