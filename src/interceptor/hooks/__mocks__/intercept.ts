export const useIntercepts = jest.fn(() => ({
  intercepts: [globalMocks.intercept],
  addIntercept: jest.fn(() => globalMocks.intercept),
  removeIntercept: jest.fn(() => {}),
}))

export const useIntercept = jest.fn(() => ({
  intercept: globalMocks.intercept,
  updateIntercept: jest.fn(() => {}),
}))
