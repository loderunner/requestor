import * as React from 'react'

import { useSelection } from './selection'
import Welcome from './Welcome'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => {
  const [, , selectionType] = useSelection()

  let view
  switch (selectionType) {
    case 'null':
      view = <Welcome />
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
