import { atom, useAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { useCallback } from 'react'

import * as Interceptor from '..'

const interceptsAtom = atom(Interceptor.intercepts as Interceptor.Intercept[])

export const useIntercepts = () => {
  const [intercepts, setIntercepts] = useAtom(interceptsAtom)

  const addIntercept = useCallback((inter: Interceptor.Intercept) => {
    Interceptor.addIntercept(inter)
    setIntercepts([...Interceptor.intercepts])
  }, [])

  const removeIntercept = useCallback((inter: Interceptor.Intercept) => {
    Interceptor.removeIntercept(inter)
    setIntercepts([...Interceptor.intercepts])
  }, [])

  return { intercepts, addIntercept, removeIntercept }
}

const interceptAtomsAtom = splitAtom(interceptsAtom)

export const useIntercept = (inter: Interceptor.Intercept) => {
  const { intercepts, removeIntercept } = useIntercepts()
  for (const [i, intercept] of intercepts.entries()) {
    if (intercept === inter) {
      const [interceptAtoms, removeInterceptAtom] = useAtom(interceptAtomsAtom)
      const interceptAtom = interceptAtoms[i]
      const [intercept, setIntercept] = useAtom(interceptAtom)
      return {
        intercept,
        setIntercept,
        removeIntercept: () => {
          removeInterceptAtom(interceptAtom)
          removeIntercept(intercept)
        },
      }
    }
  }

  throw new Error('intercept not found')
}
