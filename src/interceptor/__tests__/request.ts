import { chrome } from 'jest-chrome'

import { listen, unlisten } from '..'
import { continueRequest, pushRequest, requests } from '../request'

describe('[Interceptor.pushRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    await listen()
    jest.resetAllMocks()
  })

  afterEach(() => {
    unlisten()
    requests.slice(0, requests.length)
  })

  it('should add requests to list', () => {
    pushRequest(globalMocks.request)
    expect(requests).toBeArrayOfSize(1)
  })
})

describe('[Interceptor.continueRequest]', () => {
  beforeEach(async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([globalMocks.target])
    )
    await listen()
    jest.resetAllMocks()
  })

  afterEach(() => {
    unlisten()
  })

  it('should call debugger', async () => {
    await continueRequest(globalMocks.request.id)
    expect(chrome.debugger.sendCommand).toHaveBeenCalledWith(
      expect.objectContaining({ targetId: globalMocks.target.id }),
      'Fetch.continueRequest',
      expect.objectContaining({
        requestId: globalMocks.request.id,
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
