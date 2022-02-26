import { chrome } from 'jest-chrome'

import { listen, unlisten } from '..'
import {
  continueRequest,
  failRequest,
  pushRequest,
  requests,
  updateRequest,
} from '../request'

describe('[Interceptor.pushRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
    jest.clearAllMocks()
  })

  afterEach(() => {
    unlisten()
  })

  it('should add requests to list', () => {
    pushRequest(globalMocks.request)
    expect(requests).toBeArrayOfSize(1)
  })
})

describe('[Interceptor.updateRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
    jest.clearAllMocks()
  })

  afterEach(() => {
    unlisten()
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
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    requests.splice(0, requests.length)
    await listen()
    jest.clearAllMocks()
  })

  afterEach(() => {
    unlisten()
  })

  it('should call debugger', async () => {
    pushRequest(globalMocks.request)
    await continueRequest(globalMocks.request.id)
    expect(chrome.debugger.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining({ targetId: globalMocks.target.id }),
      'Fetch.continueRequest',
      expect.objectContaining({
        requestId: globalMocks.request.id,
        url: globalMocks.request.url,
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
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    await listen()
    jest.clearAllMocks()
  })

  afterEach(() => {
    unlisten()
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
