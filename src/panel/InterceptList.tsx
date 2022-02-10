import * as React from 'react'
import { useMemo, useState } from 'react'

import { Clear as ClearIcon, Plus as PlusIcon } from '@/icons'
import * as Interceptor from '@/interceptor'
import {
  Provider as InterceptProvider,
  useIntercepts,
} from '@/interceptor/react/intercept'

import List from './components/List'

interface ItemProps {
  inter: Interceptor.Intercept
  onDelete: (inter: Interceptor.Intercept) => void
}

const Item = ({ inter, onDelete }: ItemProps) => {
  const [enabled, setEnabled] = useState(inter.enabled)
  const onChange = () => {
    inter.enabled = !inter.enabled
    setEnabled(inter.enabled)
  }
  return (
    <div className="p-1 w-full flex justify-between select-none">
      <div className="flex items-center space-x-1 overflow-hidden">
        <input type="checkbox" checked={enabled} onChange={onChange} />
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
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
  const { intercepts, addIntercept, removeIntercept } = useIntercepts()

  const items = useMemo(
    () =>
      intercepts.map((inter, i) => (
        <Item key={i} inter={inter} onDelete={removeIntercept} />
      )),
    [intercepts]
  )

  const header = useMemo(
    () => (
      <div className="p-1 flex justify-between select-none bg-slate-100">
        <span className="font-bold">Intercepts</span>
        <button
          className="self-stretch"
          title="Add intercept"
          onClick={() => addIntercept('')}
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
