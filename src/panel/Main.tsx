import * as React from 'react'
import { useMemo } from 'react'

import InterceptView from './InterceptView'
import RequestView from './RequestDetails'
import { useSelection } from './selection'
import WelcomeView from './WelcomeView'

import type { Intercept, Request } from '@/interceptor'

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
        return <InterceptView interceptId={inter.id} />
      }
      case 'request': {
        const req: Request = selection as Request
        return <RequestView requestId={req.id} />
      }
    }
  }, [selection, selectionType])

  return (
    <main id="main" className={`min-h-screen ${className}`}>
      {view}
    </main>
  )
}

export default Main
