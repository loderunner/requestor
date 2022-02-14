import { atom, useAtom, useAtomValue } from 'jotai'
import { splitAtom } from 'jotai/utils'
import { useCallback } from 'react'

import * as Interceptor from '../intercept'

import type { Intercept } from '../intercept'

const interceptsAtom = atom([...Interceptor.intercepts])

export const useIntercepts = () => {
  const [intercepts, setIntercepts] = useAtom(interceptsAtom)

  const addIntercept = useCallback((inter: Intercept): Intercept => {
    const ret = Interceptor.addIntercept(inter)
    setIntercepts([...Interceptor.intercepts])
    return ret
  }, [])

  const removeIntercept = useCallback((id: string) => {
    Interceptor.removeIntercept(id)
    setIntercepts([...Interceptor.intercepts])
  }, [])

  return {
    intercepts: intercepts as ReadonlyArray<Readonly<Intercept>>,
    addIntercept,
    removeIntercept,
  }
}

const interceptAtomsAtom = splitAtom(interceptsAtom)

export const useIntercept = (id: string) => {
  for (const [i, inter] of Interceptor.intercepts.entries()) {
    if (inter.id === id) {
      const interceptAtoms = useAtomValue(interceptAtomsAtom)
      const interceptAtom = interceptAtoms[i]
      const [intercept, setIntercept] = useAtom(interceptAtom)
      return {
        intercept: intercept as Readonly<Intercept>,
        setIntercept: (newInter: Omit<Intercept, 'id'>) => {
          const inter = Interceptor.updateIntercept(id, newInter)
          if (inter === undefined) {
            throw new Error(`intercept '${id}' not found`)
          }
          setIntercept({ ...inter })
        },
      }
    }
  }

  throw new Error('intercept not found')
}
