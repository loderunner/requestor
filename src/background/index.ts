import * as requests from './requests'
import * as server from './server'

chrome.devtools.panels.create('Interceptor', '', 'static/panel.html')

const unsubscribe = requests.subscribe((req: requests.Request) => {
  server.sendRequest(req)
})

window.addEventListener('beforeunload', () => {
  unsubscribe()
  requests.unlisten()
  server.shutdown()
})

server.listen()
requests.listen()
