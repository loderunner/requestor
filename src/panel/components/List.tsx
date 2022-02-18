import * as React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[]
  header?: React.ReactNode
}

const List = ({ className = '', header = '', items = [], ...props }: Props) => {
  if (typeof header === 'string') {
    header = <div className="bg-slate-100 font-bold">{header}</div>
  }

  return (
    <div className={`flex flex-col ${className}`} role="list" {...props}>
      {header}
      <div className="overflow-y-auto">{items}</div>
    </div>
  )
}

export default List
