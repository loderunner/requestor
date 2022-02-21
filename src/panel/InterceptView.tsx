import { debounce } from 'lodash'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useIntercept } from '@/interceptor/hooks'

import type { ChangeEvent } from 'react'

interface Props {
  interceptId: string
}

const InterceptView = ({ interceptId }: Props) => {
  const { intercept, updateIntercept } = useIntercept(interceptId)
  const [pattern, setPattern] = useState(intercept.pattern)

  useEffect(() => setPattern(intercept.pattern), [intercept])

  const debouncedUpdateIntercept = useMemo<typeof updateIntercept>(
    () => debounce(updateIntercept, 500),
    [updateIntercept]
  )

  const onToggleEnabled = useCallback(() => {
    updateIntercept({ enabled: !intercept.enabled })
  }, [intercept.enabled, updateIntercept])

  const onChangePattern = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPattern(e.target.value)
      debouncedUpdateIntercept({ pattern: e.target.value })
    },
    [debouncedUpdateIntercept]
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
