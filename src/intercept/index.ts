import { Intercept, intercepts as i } from './intercept'

const readonlyIntercepts = i as ReadonlyArray<Intercept>
export const intercepts = readonlyIntercepts

export { RequestEventListener, listen, unlisten, subscribe } from './debugger'
export { Request } from './request'
export { Intercept, addIntercept, removeIntercept } from './intercept'
