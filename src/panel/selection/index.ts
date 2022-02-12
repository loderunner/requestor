import { atom, useAtom } from 'jotai'

import type { Intercept, Request } from '@/interceptor'

export type Selection = Request | Intercept | null

const selectionAtom = atom<Selection>(null)

export type SelectionType = 'null' | 'intercept' | 'request'

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
    typeof s.headers === 'object' &&
    'initialPriority' in s &&
    typeof s.initialPriority === 'string' &&
    'method' in s &&
    typeof s.method === 'string' &&
    'referrerPolicy' in s &&
    typeof s.referrerPolicy === 'string' &&
    'url' in s &&
    typeof s.url === 'string'
  ) {
    return 'request'
  }

  throw new TypeError(`${typeof s} is not a Selection`)
}

export const useSelection = () => {
  const [selection, setSelection] = useAtom(selectionAtom)
  return { selection, setSelection, selectionType: getType(selection) }
}
