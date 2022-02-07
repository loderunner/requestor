import * as React from 'react'
import { useLayoutEffect, useReducer } from 'react'

import Main from './Main'
import * as Requests from './requests'
import Sidebar from './Sidebar'

const App = () => {
  const [, pushRequest] = useReducer(
    (requests: Requests.Request[], req: Requests.Request) => [...requests, req],
    []
  )

  useLayoutEffect(() => {
    Requests.listen()
    const unsubscribe = Requests.subscribe((req) => {
      pushRequest(req)
    })

    return () => {
      unsubscribe()
      Requests.unlisten()
    }
  }, [])

  return (
    <div className="flex justify-between">
      <Sidebar className="" />
      <Main />
    </div>
  )
}

export default App
