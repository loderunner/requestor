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
  const [interceptAtoms, removeInterceptAtom] = useAtom(interceptAtomsAtom)
  for (const a of interceptAtoms) {
    const [intercept, setIntercept] = useAtom(a)
    if (intercept === inter) {
      return {
        intercept,
        setIntercept,
        removeIntercept: () => removeInterceptAtom(a),
      }
    }
  }

  throw new Error('intercept not found')
}
