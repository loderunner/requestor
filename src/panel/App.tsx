import * as React from 'react'
import { useLayoutEffect, useReducer } from 'react'

import * as Interceptor from '@/interceptor'

import Main from './Main'
import Sidebar from './Sidebar'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: Interceptor.Request[], req: Interceptor.Request) => [
      ...requests,
      req,
    ],
    []
  )

  useLayoutEffect(() => {
    Interceptor.listen()
    const unsubscribe = Interceptor.subscribe((req) => {
      pushRequest(req)
    })

    return () => {
      unsubscribe()
      Interceptor.unlisten()
    }
  }, [])

  return (
    <div id="App" className="h-screen">
      <Sidebar
        className="fixed top-0 left-0 bottom-0 w-64"
        requests={requests}
      />
      <Main className="ml-64" />
    </div>
  )
}

export default App
