import * as React from 'react'
import { useCallback } from 'react'

import { Intercept } from '@/interceptor'
import { useIntercept } from '@/interceptor/hooks'

import { useSelection } from './selection'

interface Props {
  inter: Intercept
}

const InterceptView = ({ inter }: Props) => {
  const { selection, setSelection } = useSelection()
  const { intercept, setIntercept } = useIntercept(inter)

  const onToggleEnabled = useCallback(() => {
    const inter = { ...intercept, enabled: !intercept.enabled }
    setIntercept(inter)
    if (selection === intercept) {
      setSelection(inter)
    }
  }, [selection, intercept])

  return (
    <div className="max-w-5xl mx-24 mt-8 px-8 pt-2 grid grid-cols-1 gap-6">
      <label className="block">
        <span className="text-3xl font-bold">Intercept</span>
      </label>
      <label className="block">
        <input
          type="checkbox"
          className="mt-1"
          checked={intercept.enabled}
          onChange={onToggleEnabled}
        />
        <span className="ml-1 text-sm text-gray-700">Enabled</span>
      </label>
      <label className="block">
        <span className="text-sm text-gray-700">If URL matches</span>
        <input
          type="text"
          className="mt-1 block text-sm w-full"
          placeholder="example.com"
          value={intercept.pattern}
          onChange={() => {}}
        />
      </label>
    </div>
  )
}

export default InterceptView
