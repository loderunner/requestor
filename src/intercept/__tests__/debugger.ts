import { chrome } from 'jest-chrome'

import { listen, unlisten } from '../debugger'

const target: chrome.debugger.TargetInfo = {
  attached: false,
  id: 'target',
  title: 'Title',
  type: 'targetType',
  url: 'https://example.com',
}

describe('[intercept.debugger]', () => {
  beforeEach(async () => {
    chrome.debugger.onEvent.clearListeners()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should crash without targets', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) => callback([]))

    await expect(listen()).rejects.toThrow()
  })

  it('should add a listener to debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await listen()

    expect(chrome.debugger.onEvent.hasListeners()).toBeTrue()
  })

  it('should remove the listener from debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await listen()
    await unlisten()

    expect(chrome.debugger.onEvent.hasListeners()).toBeFalse()
  })
})
