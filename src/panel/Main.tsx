import * as React from 'react'

import { Intercept } from '@/interceptor'

import InterceptView from './InterceptView'
import { useSelection } from './selection'
import WelcomeView from './WelcomeView'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => {
  const [selection, , selectionType] = useSelection()

  let view
  switch (selectionType) {
    case 'null':
      view = <WelcomeView />
      break
    case 'intercept':
      view = <InterceptView inter={selection as Intercept} />
      break
    case 'request':
      view = 'Not implemented yet'
      break
  }

  return (
    <main id="main" className={`min-h-screen ${className}`}>
      {view}
    </main>
  )
}

export default Main
