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
      case 'intercept': {
        const inter: Intercept = selection as Intercept
        if (inter.id === undefined) {
          throw new Error('missing intercept id')
        }
        return <InterceptView interceptId={inter.id} />
      }
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
