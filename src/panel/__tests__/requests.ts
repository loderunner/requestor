import { chrome } from 'jest-chrome'

import * as Requests from '../requests'

const target = {
  attached: false,
  id: 'target',
  title: 'Title',
  type: 'targetType',
  url: 'https://example.com',
}

describe('[Requests]', () => {
  beforeEach(async () => {
    chrome.debugger.onEvent.clearListeners()
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should crash without targets', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) => callback([]))

    await expect(Requests.listen()).rejects.toThrow()
  })

  it('should add a listener to debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await Requests.listen()

    expect(chrome.debugger.onEvent.hasListeners()).toBeTrue()
  })

  it('should remove the listener from debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await Requests.listen()
    await Requests.unlisten()

    expect(chrome.debugger.onEvent.hasListeners()).toBeFalse()
  })

  it('should call subscribed callback', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await Requests.listen()
    const listener = jest.fn()
    const unsubscribe = Requests.subscribe(listener)

    expect(listener).not.toBeCalled()

    const event = { request: 'toto' }
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).toBeCalledWith('toto')

    unsubscribe()
  })
})
