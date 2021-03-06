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

  const onToggleRegexp = useCallback(() => {
    updateIntercept({ regexp: !intercept.regexp })
  }, [intercept.regexp, updateIntercept])

  const onToggleInterceptResponse = useCallback(() => {
    updateIntercept({ interceptResponse: !intercept.interceptResponse })
  }, [intercept.interceptResponse, updateIntercept])

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
      <label className="mt-1 inline-flex items-center">
        <input
          type="checkbox"
          checked={intercept.enabled}
          onChange={onToggleEnabled}
        />
        <span className="ml-1 text-sm text-gray-700 dark:text-slate-100">
          Enabled
        </span>
      </label>
      <label className="mt-1 block">
        <span className="text-sm text-gray-700 dark:text-slate-100">
          If URL matches
        </span>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="block mt-1 text-sm flex-auto dark:bg-slate-600 dark:text-slate-100"
            placeholder="example.com"
            value={pattern}
            onChange={onChangePattern}
          />
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={intercept.regexp}
              onChange={onToggleRegexp}
            />
            <span className="ml-1 text-sm text-gray-700 dark:text-slate-100">
              Regexp
            </span>
          </label>
        </div>
      </label>
      <label className="mt-1 inline-flex items-center">
        <input
          type="checkbox"
          checked={intercept.interceptResponse}
          onChange={onToggleInterceptResponse}
        />
        <span className="ml-1 text-sm text-gray-700 dark:text-slate-100">
          Intercept response
        </span>
      </label>
    </div>
  )
}

export default InterceptView
