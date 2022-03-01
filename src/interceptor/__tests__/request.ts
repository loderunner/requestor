import { chrome } from 'jest-chrome'

import { listen, unlisten } from '..'
import { headersToEntries } from '../debugger'
import {
  continueRequest,
  failRequest,
  fulfillRequest,
  pushRequest,
  requests,
  updateRequest,
} from '../request'

import type { Protocol } from 'devtools-protocol'

describe('[Interceptor.pushRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation(() =>
      Promise.resolve([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
  })

  afterEach(() => {
    unlisten()
    jest.clearAllMocks()
  })

  it('should add requests to list', () => {
    pushRequest(globalMocks.request)
    expect(requests).toBeArrayOfSize(1)
  })
})

describe('[Interceptor.updateRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation(() =>
      Promise.resolve([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
  })

  afterEach(() => {
    unlisten()
    jest.clearAllMocks()
  })

  it('should update request', () => {
    pushRequest(globalMocks.request)
    expect(requests).not.toPartiallyContain({
      id: globalMocks.request.id,
      postData: 'Hello world!',
    })
    updateRequest(globalMocks.request.id, { postData: 'Hello world!' })
    expect(requests).toPartiallyContain({
      id: globalMocks.request.id,
      postData: 'Hello world!',
    })
  })

  it('should not update request with invalid id', () => {
    const request = updateRequest('toto', { postData: 'Hello World!' })
    expect(request).toBeUndefined()
  })
})

describe('[Interceptor.continueRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation(() =>
      Promise.resolve([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
  })

  afterEach(() => {
    unlisten()
    jest.clearAllMocks()
  })

  it('should call debugger', async () => {
    pushRequest(globalMocks.request)
    await continueRequest(globalMocks.request.id)
    expect(chrome.debugger.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining({ targetId: globalMocks.target.id }),
      'Fetch.continueRequest',
      expect.objectContaining({
        requestId: globalMocks.request.id,
        interceptResponse: globalMocks.request.interceptResponse,
        url: globalMocks.request.url,
        method: globalMocks.request.method,
        headers: headersToEntries(globalMocks.request.headers),
        postData: window.btoa(globalMocks.request.postData as string),
      })
    )
  })

  it('should remove request from requests list', async () => {
    pushRequest(globalMocks.request)
    expect(requests).toBeArrayOfSize(1)

    await continueRequest(globalMocks.request.id)
    expect(requests).toBeArrayOfSize(0)
  })
})

describe('[Interceptor.failRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation(() =>
      Promise.resolve([globalMocks.target])
    )
    await listen()
  })

  afterEach(() => {
    unlisten()
    jest.clearAllMocks()
  })

  it('should call debugger', async () => {
    await failRequest(globalMocks.request.id)
    expect(chrome.debugger.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining({ targetId: globalMocks.target.id }),
      'Fetch.failRequest',
      expect.objectContaining({
        requestId: globalMocks.request.id,
        errorReason: 'Aborted',
      })
    )
  })

  it('should remove request from requests list', async () => {
    pushRequest(globalMocks.request)
    expect(requests).toBeArrayOfSize(1)

    await failRequest(globalMocks.request.id)
    expect(requests).toBeArrayOfSize(0)
  })
})

describe('[Interceptor.fulfillRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation(() =>
      Promise.resolve([globalMocks.target])
    )
    await listen()
  })

  afterEach(() => {
    unlisten()
    jest.clearAllMocks()
  })

  it('should call debugger', async () => {
    pushRequest(globalMocks.response)
    await fulfillRequest(globalMocks.response.id)
    expect(chrome.debugger.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining<chrome.debugger.Debuggee>({
        targetId: globalMocks.target.id,
      }),
      'Fetch.fulfillRequest',
      expect.objectContaining<Protocol.Fetch.FulfillRequestRequest>({
        requestId: globalMocks.response.id,
        responseCode: globalMocks.response.statusCode as number,
        responsePhrase: globalMocks.response.statusText as string,
        responseHeaders: expect.arrayContaining<Protocol.Fetch.HeaderEntry>(
          headersToEntries(globalMocks.response.headers)
        ),
      })
    )
  })

  it('should remove request from requests list', async () => {
    pushRequest(globalMocks.response)
    expect(requests).toBeArrayOfSize(1)

    await fulfillRequest(globalMocks.response.id)
    expect(requests).toBeArrayOfSize(0)
  })
})
