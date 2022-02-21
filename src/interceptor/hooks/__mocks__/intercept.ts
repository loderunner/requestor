const intercepts = [globalMocks.intercept]
const addIntercept = jest.fn(() => globalMocks.intercept)
const removeIntercept = jest.fn(() => {})

export const useIntercepts = jest.fn(() => ({
  intercepts,
  addIntercept,
  removeIntercept,
}))

const updateIntercept = jest.fn(() => {})

export const useIntercept = jest.fn(() => ({
  intercept: globalMocks.intercept,
  updateIntercept,
}))
