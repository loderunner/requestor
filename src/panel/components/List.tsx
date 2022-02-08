import * as React from 'react'

interface Props<T> {
  className?: string
  items?: T[]
  header?: React.ReactNode
}

const List = <T,>({ className, header = '', items = [] }: Props<T>) => (
  <div className={`flex flex-col ${className}`}>
    <div className="font-bold bg-slate-100">{header}</div>
    <div className="overflow-y-auto">{items}</div>
  </div>
)

export default List
