import * as React from 'react'

import List from './components/List'

interface Props {
  className?: string
}

const InterceptList = ({ className }: Props) => {
  return <List className={className} header="Intercepts"></List>
}

export default InterceptList
