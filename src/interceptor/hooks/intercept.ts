import { atom, useAtom } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { useCallback } from 'react'

import * as Interceptor from '../intercept'

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
  const [intercepts, setIntercepts] = useAtom(interceptsAtom)
  for (const [i, intercept] of intercepts.entries()) {
    if (intercept === inter) {
      const [interceptAtoms, removeInterceptAtom] = useAtom(interceptAtomsAtom)
      const interceptAtom = interceptAtoms[i]
      const [intercept, updateIntercept] = useAtom(interceptAtom)
      return {
        intercept,
        setIntercept: (newInter: Interceptor.Intercept) => {
          updateIntercept(newInter)
          const j = Interceptor.intercepts.findIndex((old) => old === inter)
          if (j !== -1) {
            Interceptor.intercepts.splice(j, 1, newInter)
          }
          setIntercepts([...Interceptor.intercepts])
        },
        removeIntercept: () => {
          removeInterceptAtom(interceptAtom)
          Interceptor.removeIntercept(inter)
          setIntercepts([...Interceptor.intercepts])
        },
      }
    }
  }

  throw new Error('intercept not found')
}
