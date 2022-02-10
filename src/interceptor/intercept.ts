export interface Intercept {
  pattern?: string
  enabled: boolean
}

export const intercepts: Intercept[] = []

export const addIntercept = (intercept: Intercept) => {
  intercepts.push(intercept)
}

export const removeIntercept = (intercept: Intercept) => {
  const i = intercepts.indexOf(intercept)
  if (i !== -1) {
    intercepts.splice(i, 1)
  }
}
