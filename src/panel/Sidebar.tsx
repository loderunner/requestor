import * as React from 'react'

import * as Intercept from '@/intercept'

import InterceptList from './InterceptList'
import RequestList from './RequestList'

interface Props {
  className?: string
  requests: Intercept.Request[]
}

const Sidebar = ({ className, requests }: Props) => (
  <aside
    id="sidebar"
    className={`flex flex-col justify-between border-r border-slate-300 ${className}`}
  >
    <RequestList className="flex-initial overflow-y-auto" requests={requests} />
    <InterceptList className="flex-none overflow-y-auto" />
  </aside>
)

export default Sidebar
