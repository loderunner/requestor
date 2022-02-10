import * as React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  items?: React.ReactNode[]
  header?: React.ReactNode
}

const List = ({ className, header = '', items = [], ...props }: Props) => {
  if (typeof header === 'string') {
    header = <div className="font-bold bg-slate-100">{header}</div>
  }

  return (
    <div className={`flex flex-col ${className}`} {...props}>
      {header}
      <div className="flex flex-col overflow-y-auto">{items}</div>
    </div>
  )
}

export default List
