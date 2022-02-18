import { chrome } from 'jest-chrome'

import { RequestPausedEvent, listen, unlisten } from '../debugger'
import { addIntercept, intercepts, removeIntercept } from '../intercept'
import { subscribe } from '../request'

const target: chrome.debugger.TargetInfo = {
  attached: false,
  id: 'target',
  title: 'Title',
  type: 'targetType',
  url: 'https://example.com',
}

const event: RequestPausedEvent = {
  frameId: '1',
  requestId: '1',
  resourceType: 'Fetch',
  request: {
    headers: {},
    initialPriority: 'Medium',
    method: 'GET',
    referrerPolicy: 'same-origin',
    url: 'https://example.com',
  },
}

describe('[intercept]', () => {
  // unsubscribe callback placeholder - shared between tests
  let unsubscribe = () => {}

  // listener callback mock - shared between tests
  const listener = jest.fn()

  beforeEach(async () => {
    jest.resetAllMocks()
    intercepts.splice(0, intercepts.length)

    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await listen()
    unsubscribe = subscribe(listener)
  })

  afterEach(() => {
    unsubscribe()
    unlisten()
  })

  it('should not call subscribed callback with no event', () => {
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback without an intercept', () => {
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).not.toBeCalled()
    expect(chrome.debugger.sendCommand).toBeCalledWith(
      { targetId: target.id },
      'Fetch.continueRequest',
      expect.anything()
    )
  })

  it('should call subscribed callback with an intercept', () => {
    addIntercept({ pattern: 'example.com', enabled: true })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).toBeCalledWith({ id: event.requestId, ...event.request })
  })

  it('should not call subscribed callback twice if 2 intercepts match', () => {
    addIntercept({ pattern: 'example.com', enabled: true })
    addIntercept({ pattern: 'example', enabled: true })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).toBeCalledTimes(1)
  })

  it('should not call subscribed callback with a disabled intercept', () => {
    addIntercept({ pattern: 'example.com', enabled: false })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback without a matching intercept', () => {
    addIntercept({ pattern: 'eixample.com', enabled: true })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback after removing intercept', () => {
    const inter = addIntercept({ pattern: 'eixample.com', enabled: true })
    removeIntercept(inter.id as string)
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      event
    )
    expect(listener).not.toBeCalled()
  })
})
