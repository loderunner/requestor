import { chrome } from 'jest-chrome'

import * as Debugger from '../debugger'
import {
  RequestPausedEvent,
  headersToEntries,
  listen,
  unlisten,
} from '../debugger'
import {
  addIntercept,
  intercepts,
  removeIntercept,
  updateIntercept,
} from '../intercept'
import { subscribe } from '../request'

const target = globalMocks.target

const requestEvent: RequestPausedEvent = {
  frameId: '1',
  requestId: '1',
  resourceType: 'Fetch',
  request: globalMocks.request,
}

const responseEvent: RequestPausedEvent = {
  frameId: '1',
  requestId: '1',
  resourceType: 'Fetch',
  request: globalMocks.response,
  responseStatusCode: 200,
  responseStatusText: '',
  responseHeaders: headersToEntries(globalMocks.response.headers),
}

const responseErrorEvent: RequestPausedEvent = {
  frameId: '1',
  requestId: '1',
  resourceType: 'Fetch',
  request: globalMocks.request,
  responseErrorReason: 'ConnectionClosed',
}

describe('[Interceptor.subscribe]', () => {
  // unsubscribe callback placeholder - shared between tests
  let unsubscribe = () => {}

  // listener callback mock - shared between tests
  const listener = jest.fn()

  beforeEach(async () => {
    Debugger.unpause()
    jest.clearAllMocks()
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
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should call subscribed callback with a matching string intercept', () => {
    addIntercept(globalMocks.intercept)
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).toBeCalledWith({
      id: requestEvent.requestId,
      ...requestEvent.request,
    })
  })

  it('should call subscribed callback with a matching regexp intercept', () => {
    addIntercept({ ...globalMocks.intercept, pattern: '.*', regexp: true })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).toBeCalledWith({
      id: requestEvent.requestId,
      ...requestEvent.request,
    })

    addIntercept({
      ...globalMocks.intercept,
      pattern: '(example)',
      regexp: true,
    })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).toBeCalledWith({
      id: requestEvent.requestId,
      ...requestEvent.request,
    })
  })

  it('should not call subscribed callback twice if 2 intercepts match', () => {
    addIntercept(globalMocks.intercept)
    addIntercept({ ...globalMocks.intercept, pattern: 'example' })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).toBeCalledTimes(1)
  })

  it('should not call subscribed callback with a disabled intercept', () => {
    addIntercept({ ...globalMocks.intercept, enabled: false })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback without a matching string pattern', () => {
    addIntercept({ ...globalMocks.intercept, pattern: 'eixample.com' })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback without a matching regexp pattern', () => {
    addIntercept({ ...globalMocks.intercept, pattern: '.*' })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()

    updateIntercept(globalMocks.intercept.id, {
      pattern: 'hello',
      regexp: true,
    })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback without an invalid regexp pattern', () => {
    addIntercept({ ...globalMocks.intercept, pattern: '(example' })
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should call subscribed callback for a response event', () => {
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      responseEvent
    )
    expect(listener).toBeCalledWith({
      id: responseEvent.requestId,
      stage: 'Response',
      ...responseEvent.request,
    })
  })

  it('should not call subscribed callback for a response error event', () => {
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      responseErrorEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback when debugger is paused', () => {
    Debugger.pause()
    addIntercept(globalMocks.intercept)
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })

  it('should not call subscribed callback after removing intercept', () => {
    const inter = addIntercept({
      ...globalMocks.intercept,
      pattern: 'eixample.com',
    })
    removeIntercept(inter.id as string)
    chrome.debugger.onEvent.callListeners(
      { targetId: target.id },
      'Fetch.requestPaused',
      requestEvent
    )
    expect(listener).not.toBeCalled()
  })
})
