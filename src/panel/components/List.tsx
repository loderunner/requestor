import * as React from 'react'

interface Props {
  className?: string
  items?: React.ReactNode[]
  header?: React.ReactNode
}

const List = ({ className, header = '', items = [] }: Props) => (
  <div className={`flex flex-col ${className}`}>
    <div className="font-bold bg-slate-100">{header}</div>
    <div className="overflow-y-auto">{items}</div>
  </div>
)

export default List
