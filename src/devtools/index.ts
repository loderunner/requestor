import * as Requests from './requests'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')

const interceptor = Requests.createInterceptor()
const { requests$, continue$ } = interceptor

const subscription = requests$.subscribe((args) => {
  if (args === null) {
    return
  }

  const [, , params] = args

  console.log('====== INTERCEPTED ======', params)

  if (params === undefined) {
    return
  }

  chrome.runtime.sendMessage({ type: 'pausedRequest', payload: params })
})

/**
 * Temporary impure handlers, booh, impure !
 */

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'continue') {
    continue$.next({
      requestId: message.payload.requestId,
      request: message.payload.request,
    })
  }
})

window.addEventListener('beforeunload', () => {
  subscription.unsubscribe()
})
