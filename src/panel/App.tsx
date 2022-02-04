import * as React from 'react'
import { useLayoutEffect, useReducer } from 'react'

import * as Requests from './requests'

const App = () => {
  const [requests, pushRequest] = useReducer(
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
    <>
      <h1>Hello World!</h1>
      <div>
        {requests.map((request, i) => (
          <div key={i}>
            {request.method} {request.url}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
