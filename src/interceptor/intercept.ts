export interface Intercept {
  id: string
  pattern: string
  enabled: boolean
  regexp: boolean
}

export const intercepts: Intercept[] = []
let id = 0

export const addIntercept = (
  inter: Omit<Intercept, 'id'>
): Readonly<Intercept> => {
  const newInter: Intercept = { ...inter, id: `intercept-${id++}` }
  intercepts.push(newInter)
  return newInter
}

export const getIntercept = (id: string): Readonly<Intercept> | undefined => {
  return intercepts.find((inter) => inter.id === id)
}

export const updateIntercept = (
  id: string,
  inter: Partial<Intercept>
): Readonly<Intercept> | undefined => {
  const current = intercepts.find((i) => i.id === id)
  if (current !== undefined) {
    current.pattern = inter.pattern ?? current.pattern
    current.enabled = inter.enabled ?? current.enabled
    current.regexp = inter.regexp ?? current.regexp
  }
  return current
}

export const removeIntercept = (id: string): void => {
  const i = intercepts.findIndex((inter) => inter.id === id)
  if (i !== -1) {
    intercepts.splice(i, 1)
  }
}
