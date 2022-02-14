import * as React from 'react'
import { useCallback, useMemo } from 'react'

import { Clear as ClearIcon, Plus as PlusIcon } from '@/icons'
import { useIntercept, useIntercepts } from '@/interceptor/hooks'

import List from './components/List'
import { useSelection } from './selection'

import type { Intercept } from '@/interceptor'
import type { SyntheticEvent } from 'react'

interface ItemProps {
  interceptId?: string
  onDelete: (inter: Intercept) => void
}

const Item = ({ interceptId, onDelete }: ItemProps) => {
  if (interceptId === undefined) {
    throw new Error('missing intercept id')
  }

  const { selection, setSelection, selectionType } = useSelection()
  const { intercept, updateIntercept } = useIntercept(interceptId)

  const onToggleEnabled = useCallback(() => {
    updateIntercept({ ...intercept, enabled: !intercept.enabled })
  }, [intercept])

  const onClickDelete = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      onDelete(intercept)
    },
    [intercept, onDelete]
  )

  const onSelect = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      setSelection({ ...intercept })
    },
    [intercept]
  )

  const className = useMemo(() => {
    let className = 'flex w-full select-none justify-between p-1'
    if (selectionType !== 'intercept') {
      return className
    }
    const s = selection as Intercept
    if (s.id === intercept.id) {
      className += ' bg-blue-100'
    }
    return className
  }, [selection, intercept])

  return (
    <div className={className} onClick={onSelect}>
      <div className="flex items-center space-x-1 overflow-hidden">
        <input
          type="checkbox"
          className="focus:ring-0"
          checked={intercept.enabled}
          onClick={(e) => e.stopPropagation()}
          onChange={onToggleEnabled}
        />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {intercept.pattern}
        </span>
      </div>
      <button
        className="self-stretch"
        title="Delete intercept"
        onClick={onClickDelete}
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
  const { selection, setSelection, selectionType } = useSelection()
  const { intercepts, addIntercept, removeIntercept } = useIntercepts()

  const onDeleteIntercept = useCallback(
    (inter: Intercept) => {
      if (inter.id === undefined) {
        throw new Error('missing intercept id')
      }
      if (selectionType === 'intercept') {
        const s = selection as Intercept
        if (s.id === inter.id) {
          setSelection(null)
        }
      }
      removeIntercept(inter.id)
    },
    [selection]
  )

  const items = useMemo(
    () =>
      intercepts.map((inter) => (
        <Item
          key={inter.id}
          interceptId={inter.id}
          onDelete={onDeleteIntercept}
        />
      )),
    [intercepts, selection]
  )

  const onAddIntercept = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      const inter = addIntercept({ pattern: '', enabled: true })
      setSelection({ ...inter })
    },
    [intercepts]
  )

  const header = useMemo(
    () => (
      <div className="flex select-none justify-between bg-slate-100 p-1">
        <span className="font-bold">Intercepts</span>
        <button
          className="self-stretch"
          title="Add intercept"
          onClick={onAddIntercept}
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
