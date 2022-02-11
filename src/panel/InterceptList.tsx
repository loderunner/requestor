import * as React from 'react'
import { useMemo, useState } from 'react'

import { Clear as ClearIcon, Plus as PlusIcon } from '@/icons'
import { Intercept } from '@/interceptor'
import { useIntercepts } from '@/interceptor/react'

import List from './components/List'
import { useSelection } from './selection'

interface ItemProps {
  className?: string
  inter: Intercept
  onDelete: (inter: Intercept) => void
}

const Item = ({ className = '', inter, onDelete }: ItemProps) => {
  const [enabled, setEnabled] = useState(inter.enabled)
  const onChange = () => {
    inter.enabled = !inter.enabled
    setEnabled(inter.enabled)
  }
  return (
    <div className={`flex w-full select-none justify-between p-1 ${className}`}>
      <div className="flex items-center space-x-1 overflow-hidden">
        <input
          type="checkbox"
          className="focus:ring-0"
          checked={enabled}
          onChange={onChange}
        />
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {inter.pattern}
        </span>
      </div>
      <button
        className="self-stretch"
        title="Delete intercept"
        onClick={() => onDelete(inter)}
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
  const [selection, setSelection] = useSelection()
  const { intercepts, addIntercept, removeIntercept } = useIntercepts()

  const onClick = () => {
    const inter: Intercept = { pattern: '', enabled: true }
    addIntercept(inter)
    setSelection(inter)
  }

  const onDelete = (inter: Intercept) => {
    if (selection === inter) {
      setSelection(null)
    }
    removeIntercept(inter)
  }

  const items = useMemo(
    () =>
      intercepts.map((inter, i) => (
        <Item
          key={i}
          className={inter === selection ? 'bg-blue-100' : ''}
          inter={inter}
          onDelete={onDelete}
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
