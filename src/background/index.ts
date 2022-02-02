import * as requests from './requests'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')

const unsubscribe = requests.subscribe((req: requests.Request) => {
  const d = new Date()
  console.log(`${d.toISOString()} - ${req.method} ${req.url}`)
})

window.addEventListener('beforeunload', () => {
  unsubscribe()
  requests.unlisten()
})

requests.listen()
