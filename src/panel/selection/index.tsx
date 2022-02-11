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

type SelectionType = 'null' | 'intercept' | 'request'

type HookType = [
  Selection,
  React.Dispatch<React.SetStateAction<Selection>>,
  SelectionType
]

const getType = (s: Selection): SelectionType => {
  if (s === null) {
    return 'null'
  }
  if (
    'pattern' in s &&
    typeof s.pattern === 'string' &&
    'enabled' in s &&
    typeof s.enabled === 'boolean'
  ) {
    return 'intercept'
  }
  if (
    'headers' in s &&
    typeof 'headers' === 'object' &&
    'initialPriority' in s &&
    typeof 'initialPriority' === 'string' &&
    'method' in s &&
    typeof 'method' === 'string' &&
    'referrerPolicy' in s &&
    typeof 'referrerPolicy' === 'string' &&
    'url' in s &&
    typeof 'url' === 'string'
  ) {
    return 'request'
  }

  throw new TypeError(`${typeof s} is not a Selection`)
}

export const useSelection = (): HookType => {
  const { selection, setSelection } = useContext(SelectionContext)
  return [selection, setSelection, getType(selection)]
}
