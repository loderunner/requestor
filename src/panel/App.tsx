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
      <h1 className="text-3xl">Hello World!</h1>
      <ul className="list-none">
        {requests.map((request, i) => (
          <li key={i}>
            {request.method} {request.url}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
