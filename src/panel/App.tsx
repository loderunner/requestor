import * as React from 'react'
import { useLayoutEffect, useReducer } from 'react'

import * as Intercept from '@/intercept'

import Main from './Main'
import Sidebar from './Sidebar'

const App = () => {
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
    <div className="flex justify-between">
      <Sidebar className="" />
      <Main />
    </div>
  )
}

export default App
