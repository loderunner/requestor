import * as React from 'react'

import { LevelCrossing } from '@/icons'
import { useIntercepts } from '@/interceptor/react'

interface Props {
  className?: string
}

const Welcome = ({ className = '' }: Props) => {
  const { addIntercept } = useIntercepts()

  return (
    <div
      id="welcome"
      className={`container min-h-screen flex flex-col justify-center items-center bg-slate-50 ${className}`}
    >
      <div className="container max-w-xs">
        <LevelCrossing className="w-full h-auto fill-indigo-700" />
      </div>
      <div className="font-bold text-4xl">Welcome to Interceptor</div>
      <button
        className="px-9 py-3 my-6 rounded font-semibold bg-indigo-700 text-sm text-white hover:opacity-75 active:opacity-100"
        title="Add intercept"
        onClick={() => addIntercept('')}
      >
        Add Intercept
      </button>
    </div>
  )
}

export default Welcome
