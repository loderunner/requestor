import * as React from 'react'
import { useLayoutEffect } from 'react'

import * as Interceptor from '@/interceptor'
import { RequestProvider } from '@/interceptor/hooks'

import Main from './Main'
import Sidebar from './Sidebar'

const App = () => {
  useLayoutEffect(() => {
    Interceptor.listen()

    return () => {
      Interceptor.unlisten()
    }
  }, [])

  return (
    <RequestProvider>
      <div id="App">
        <Sidebar className="fixed top-0 left-0 bottom-0 w-64" />
        <Main className="ml-64" />
      </div>
    </RequestProvider>
  )
}

export default App
