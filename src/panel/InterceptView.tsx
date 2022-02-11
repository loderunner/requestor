import * as React from 'react'

import { Intercept } from '@/interceptor'

interface Props {
  inter: Intercept
}

const InterceptView = ({ inter }: Props) => {
  return (
    <div className="max-w-5xl mx-24 mt-8 px-8 pt-2 grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-3xl font-bold">Intercept</span>
      </label>
      <label className="block">
        <span className="text-sm text-gray-700">If URL matches</span>
        <input
          type="text"
          className="mt-1 block text-sm w-full"
          placeholder="example.com"
          value={inter.pattern}
          onChange={() => {}}
        />
      </label>
    </div>
  )
}

export default InterceptView
