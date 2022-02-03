import * as requests from './requests'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')
;(async function () {
  console.log('Init interceptor')
  const interceptor = await requests.createInterceptor()
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

    continue$.next({ requestId: params.requestId, request: params.request })
  })

  window.addEventListener('beforeunload', () => {
    subscription.unsubscribe()
  })
})()
