import { chrome } from 'jest-chrome'

// import index for side-effects
import '../index'

describe('[Background script]', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should create a panel', () => {
    expect(chrome.devtools.panels.create).toBeCalled()
  })
})
