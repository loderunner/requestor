import { debounce } from 'lodash'
import * as React from 'react'
import { useCallback, useState } from 'react'

import { useIntercept } from '@/interceptor/hooks'

interface Props {
  interceptId: string
}

const InterceptView = ({ interceptId }: Props) => {
  const { intercept, setIntercept } = useIntercept(interceptId)
  const debouncedSetIntercept = debounce(setIntercept, 500)
  const [pattern, setPattern] = useState(intercept.pattern)

  const onToggleEnabled = useCallback(() => {
    setIntercept({ enabled: !intercept.enabled })
  }, [intercept])

  const onChangePattern = useCallback(
    (e) => {
      setPattern(e.target.value)
      debouncedSetIntercept({ pattern: e.target.value })
    },
    [intercept]
  )

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
          value={pattern}
          onChange={onChangePattern}
        />
      </label>
    </div>
  )
}

export default InterceptView
