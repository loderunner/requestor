import * as React from 'react'
import { useMemo, useState } from 'react'

import * as intercept from '@/intercept'

import List from './components/List'

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
    () => intercepts.map((inter, i) => <InterceptItem key={i} inter={inter} />),
    [intercepts]
  )

  return <List className={className} header="Intercepts" items={items}></List>
}

interface ItemProps {
  inter: intercept.Intercept
}

const InterceptItem = ({ inter }: ItemProps) => (
  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
    <span>{inter.pattern}</span>
  </div>
)

export default InterceptList
