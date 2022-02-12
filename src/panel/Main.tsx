import * as React from 'react'
import { useMemo } from 'react'

import { Intercept } from '@/interceptor'

import InterceptView from './InterceptView'
import { useSelection } from './selection'
import WelcomeView from './WelcomeView'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => {
  const { selection, selectionType } = useSelection()

  const view: React.ReactNode = useMemo(() => {
    switch (selectionType) {
      case 'null':
        return <WelcomeView />
      case 'intercept':
        return <InterceptView inter={selection as Intercept} />
      case 'request':
        return 'Not implemented yet'
    }
  }, [selection])

  return (
    <main id="main" className={`min-h-screen ${className}`}>
      {view}
    </main>
  )
}

export default Main
