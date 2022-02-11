import * as React from 'react'
import { createContext, useContext, useState } from 'react'

import { Intercept, Request } from '@/interceptor'

export type Selection = Request | Intercept | null

interface ContextType {
  selection: Selection
  setSelection: React.Dispatch<React.SetStateAction<Selection>>
}

const SelectionContext = createContext<ContextType>({
  selection: null,
  setSelection: () => {},
})

interface Props {
  children: React.ReactNode
}

export const Provider = ({ children }: Props) => {
  const [selection, setSelection] = useState<Selection>(null)

  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  )
}

export const useSelection = () => {
  const { selection, setSelection } = useContext(SelectionContext)
  return [selection, setSelection] as [
    Selection,
    React.Dispatch<React.SetStateAction<Selection>>
  ]
}
