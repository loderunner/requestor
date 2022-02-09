import * as React from 'react'
import { useMemo, useState } from 'react'

import { Plus as PlusIcon } from '@/icons'
import * as intercept from '@/intercept'

import List from './components/List'

interface ItemProps {
  inter: intercept.Intercept
}

const Item = ({ inter }: ItemProps) => (
  <div className="select-none whitespace-nowrap overflow-hidden text-ellipsis">
    <span>{inter.pattern}</span>
  </div>
)

interface Props {
  className?: string
}

const InterceptList = ({ className }: Props) => {
  const [intercepts, setIntercepts] = useState([...intercept.intercepts])
  const addIntercept = (pattern: string) => {
    intercept.addIntercept({ pattern, enabled: true })
    setIntercepts([...intercept.intercepts])
  }

  const items = useMemo(
    () => intercepts.map((inter, i) => <Item key={i} inter={inter} />),
    [intercepts]
  )

  const header = useMemo(
    () => (
      <div className="p-1 flex justify-between select-none bg-slate-100">
        <span className="font-bold">Intercepts</span>
        <button
          className="self-stretch"
          title="Add intercept"
          onClick={() => addIntercept('gql')}
        >
          <PlusIcon className="h-full w-auto" />
        </button>
      </div>
    ),
    []
  )

  return <List className={className} header={header} items={items}></List>
}

export default InterceptList
