import * as React from 'react'
import { useLayoutEffect, useReducer } from 'react'

import * as Intercept from '@/intercept'

import Main from './Main'
import Sidebar from './Sidebar'

const App = () => {
  const [requests, pushRequest] = useReducer(
    (requests: Intercept.Request[], req: Intercept.Request) => [
      ...requests,
      req,
    ],
    []
  )

  useLayoutEffect(() => {
    Intercept.listen()
    const unsubscribe = Intercept.subscribe((req) => {
      pushRequest(req)
    })

    return () => {
      unsubscribe()
      Intercept.unlisten()
    }
  }, [])

  return (
    <div className="h-screen">
      <Sidebar
        className="fixed top-0 left-0 bottom-0 w-64"
        requests={requests}
      />
      <Main className="ml-64" />
    </div>
  )
}

export default App
