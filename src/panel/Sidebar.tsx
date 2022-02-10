import * as React from 'react'

import * as Interceptor from '@/interceptor'
import { InterceptProvider } from '@/interceptor/react'

import InterceptList from './InterceptList'
import RequestList from './RequestList'

interface Props {
  className?: string
  requests: Interceptor.Request[]
}

const Sidebar = ({ className = '', requests }: Props) => (
  <aside
    id="sidebar"
    className={`flex flex-col justify-between border-r border-slate-300 ${className}`}
  >
    <RequestList className="flex-initial overflow-y-auto" requests={requests} />

    <InterceptProvider>
      <InterceptList className="flex-none overflow-y-auto" />
    </InterceptProvider>
  </aside>
)

export default Sidebar
