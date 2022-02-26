import * as React from 'react'

import { Plus as PlusIcon } from '@/icons'

interface AddButtonProps {
  depth?: number
  onClick?: () => void
}

const AddButton = ({ depth = 0, onClick }: AddButtonProps) => (
  <button
    className="absolute h-2 -mt-0.5 first:-mt-1.5 group opacity-0 hover:opacity-100"
    style={{
      marginLeft: `${depth}rem`,
      width: `calc(100% - ${depth}rem)`,
      zIndex: depth,
    }}
    onClick={onClick}
  >
    <div className="absolute left-0 right-0 h-0.5 -translate-y-1/2 bg-slate-300 group-hover:bg-slate-400 group-active:bg-slate-500" />
    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-sm bg-white border-slate-300 group-hover:border-slate-400 group-active:border-slate-500">
      <PlusIcon className=" fill-slate-300  group-hover:fill-slate-400 group-active:fill-slate-500" />
    </div>
  </button>
)

export default AddButton
