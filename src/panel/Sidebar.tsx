import * as React from 'react'

import * as Interceptor from '@/interceptor'

import InterceptList from './InterceptList'
import RequestList from './RequestList'

interface Props {
  className?: string
}

const Sidebar = ({ className = '' }: Props) => (
  <aside
    id="sidebar"
    className={`flex flex-col justify-between border-r border-slate-300 ${className}`}
  >
    <RequestList className="flex-initial overflow-y-auto" />

    <InterceptList className="flex-none overflow-y-auto" />
  </aside>
)

export default Sidebar
