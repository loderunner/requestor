import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { Clear as ClearIcon, Plus as PlusIcon } from '@/icons'
import { Intercept } from '@/interceptor'
import { useIntercept, useIntercepts } from '@/interceptor/hooks'

import List from './components/List'
import { useSelection } from './selection'

interface ItemProps {
  className?: string
  inter: Intercept
}

const Item = ({ className = '', inter }: ItemProps) => {
  const { selection, setSelection } = useSelection()
  const { intercept, setIntercept, removeIntercept } = useIntercept(inter)

  const onToggleEnabled = useCallback(() => {
    const inter = { ...intercept, enabled: !intercept.enabled }
    setIntercept(inter)
    if (intercept === selection) {
      setSelection(inter)
    }
  }, [intercept, selection])

  const onDelete = useCallback(() => {
    if (intercept === selection) {
      setSelection(null)
    }
    removeIntercept()
  }, [intercept, selection])

  return (
    <div className={`flex w-full select-none justify-between p-1 ${className}`}>
      <div className="flex items-center space-x-1 overflow-hidden">
        <input
          type="checkbox"
          className="focus:ring-0"
          checked={intercept.enabled}
          onChange={onToggleEnabled}
        />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {inter.pattern}
        </span>
      </div>
      <button
        className="self-stretch"
        title="Delete intercept"
        onClick={onDelete}
      >
        <ClearIcon className="h-full w-auto" />
      </button>
    </div>
  )
}

interface Props {
  className?: string
}

const InterceptList = ({ className }: Props) => {
  const { selection, setSelection } = useSelection()
  const { intercepts, addIntercept } = useIntercepts()

  const onClick = useCallback(() => {
    const inter: Intercept = { pattern: '', enabled: true }
    addIntercept(inter)
    setSelection(inter)
  }, [])

  const items = useMemo(
    () =>
      intercepts.map((inter, i) => (
        <Item
          key={i}
          className={inter === selection ? 'bg-blue-100' : ''}
          inter={inter}
        />
      )),
    [intercepts, selection]
  )

  const header = useMemo(
    () => (
      <div className="flex select-none justify-between bg-slate-100 p-1">
        <span className="font-bold">Intercepts</span>
        <button
          className="self-stretch"
          title="Add intercept"
          onClick={onClick}
        >
          <PlusIcon className="h-full w-auto" />
        </button>
      </div>
    ),
    []
  )

  return (
    <List
      id="intercept-list"
      className={className}
      header={header}
      items={items}
    ></List>
  )
}

export default InterceptList
