import * as React from 'react'

import { useSelection } from './selection'
import WelcomeView from './WelcomeView'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => {
  const [, , selectionType] = useSelection()

  let view
  switch (selectionType) {
    case 'null':
      view = <WelcomeView />
      break
    case 'intercept':
      view = 'Not implemented yet'
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
