import * as React from 'react'
import { createContext, useContext, useState } from 'react'

import * as interceptor from '..'

interface InterceptContextType {
  intercepts: interceptor.Intercept[]
  addIntercept: (inter: interceptor.Intercept) => void
  removeIntercept: (inter: interceptor.Intercept) => void
}

const InterceptContext = createContext<InterceptContextType>({
  intercepts: [],
  addIntercept: () => {},
  removeIntercept: () => {},
})

interface Props {
  children: React.ReactNode
}

export const Provider = ({ children }: Props) => {
  const [intercepts, setIntercepts] = useState([...interceptor.intercepts])

  const addIntercept = (inter: interceptor.Intercept) => {
    interceptor.addIntercept(inter)
    setIntercepts([...interceptor.intercepts])
  }
  const removeIntercept = (inter: interceptor.Intercept) => {
    interceptor.removeIntercept(inter)
    setIntercepts([...interceptor.intercepts])
  }

  return (
    <InterceptContext.Provider
      value={{ intercepts, addIntercept, removeIntercept }}
    >
      {children}
    </InterceptContext.Provider>
  )
}

export const useIntercepts = () => useContext(InterceptContext)
