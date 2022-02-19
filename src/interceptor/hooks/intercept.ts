import { useAtom, useAtomValue } from 'jotai'
import { atomWithStorage, splitAtom } from 'jotai/utils'
import { useCallback } from 'react'

import { addIntercept } from '..'
import * as Interceptor from '../intercept'

import type { Intercept } from '../intercept'

const storage = {
  getItem: (key: string): Intercept[] => {
    try {
      const json = localStorage.getItem(key)
      const intercepts = JSON.parse(json as string)
      for (const inter of intercepts as Intercept[]) {
        addIntercept(inter)
      }
      return [...Interceptor.intercepts]
    } catch (err) {
      return []
    }
  },
  setItem: (key: string, newIntercepts: Intercept[]) => {
    localStorage.setItem(key, JSON.stringify(newIntercepts))
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key)
  },
}

const interceptsAtom = atomWithStorage(
  'intercepts',
  [...Interceptor.intercepts],
  storage
)

export const useIntercepts = () => {
  const [intercepts, setIntercepts] = useAtom(interceptsAtom)

  const addIntercept = useCallback(
    (inter: Omit<Intercept, 'id'>): Intercept => {
      const ret = Interceptor.addIntercept(inter)
      setIntercepts([...Interceptor.intercepts])
      return ret
    },
    []
  )

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
        updateIntercept: (newInter: Partial<Intercept>) => {
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
