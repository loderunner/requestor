import * as React from 'react'

import { LevelCrossing } from '@/icons'
import { Intercept } from '@/interceptor'
import { useIntercepts } from '@/interceptor/react'

import { useSelection } from './selection'

interface Props {
  className?: string
}

const Welcome = ({ className = '' }: Props) => {
  const [, setSelection] = useSelection()
  const { addIntercept } = useIntercepts()

  const onClick = () => {
    const inter: Intercept = { pattern: '', enabled: true }
    addIntercept(inter)
    setSelection(inter)
  }

  return (
    <div
      id="welcome"
      className={`container flex min-h-screen flex-col items-center justify-center bg-slate-50 ${className}`}
    >
      <div className="container max-w-xs">
        <LevelCrossing className="h-auto w-full fill-indigo-700" />
      </div>
      <div className="text-4xl font-bold">Welcome to Interceptor</div>
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

export default Welcome
