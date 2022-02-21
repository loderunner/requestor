import * as React from 'react'
import { useCallback } from 'react'

import { LevelCrossing } from '@/icons'
import { useIntercepts } from '@/interceptor/hooks'

import { useSelection } from './selection'

interface Props {
  className?: string
}

const WelcomeView = ({ className = '' }: Props) => {
  const { setSelection } = useSelection()
  const { addIntercept } = useIntercepts()

  const onClick = useCallback(() => {
    const inter = addIntercept({ pattern: '', enabled: true, regexp: false })
    setSelection({ ...inter })
  }, [addIntercept, setSelection])

  return (
    <div
      id="welcome-view"
      className={`container flex min-h-screen flex-col items-center justify-center bg-slate-50 ${className}`}
    >
      <div className="container max-w-xs">
        <LevelCrossing className="h-auto w-full fill-indigo-700" />
      </div>
      <div className="text-4xl font-bold">Interceptor</div>
      <button
        className="my-6 rounded bg-indigo-700 px-9 py-3 text-sm font-semibold text-white hover:opacity-75 active:opacity-100"
        title="Add intercept"
        onClick={onClick}
      >
        Add Intercept
      </button>
    </div>
  )
}

export default WelcomeView
