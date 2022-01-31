import * as requests from './requests'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')

const onRequest = (req: requests.Request) => {
  const d = new Date()
  console.log(`${d.toISOString()} - ${req.method} ${req.url}`)
}

requests.onRequest.addListener(onRequest)

window.addEventListener('beforeunload', () => {
  requests.onRequest.removeListener(onRequest)
  requests.unlisten()
})

requests.listen()
