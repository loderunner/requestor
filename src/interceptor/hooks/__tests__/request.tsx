import {
  act as actHook,
  cleanup as cleanupHooks,
  renderHook,
} from '@testing-library/react-hooks'
import * as React from 'react'
import { act } from 'react-dom/test-utils'

import { RequestProvider, useRequest, useRequests } from '..'
import * as Interceptor from '../../request'

import type { RequestEventListener } from '../../request'

jest.mock('../../request')
const mockedInterceptor = Interceptor as jest.Mocked<typeof Interceptor>

describe('[RequestHooks.useRequests]', () => {
  afterEach(() => {
    cleanupHooks()
    jest.clearAllMocks()
    mockedInterceptor.requests.splice(0, mockedInterceptor.requests.length)
  })

  it('should throw without a RequestProvider', () => {
    const { result } = renderHook(() => useRequests())
    expect(result.error).toBeDefined()
  })

  it('should return an empty array', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequests(), { wrapper })

    expect(result.current.requests).toBeArrayOfSize(0)
  })

  it('should add a request to the list on listener', () => {
    let listener: RequestEventListener = () => {
      throw new Error('listener called before subscribe')
    }
    mockedInterceptor.subscribe.mockImplementation((l) => {
      listener = l
      return jest.fn()
    })
    mockedInterceptor.pushRequest.mockImplementation((req) =>
      Interceptor.requests.push(req)
    )
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequests(), { wrapper })
    actHook(() => {
      mockedInterceptor.pushRequest(globalMocks.request)
      listener(globalMocks.request)
    })

    expect(result.current.requests).toBeArrayOfSize(1)
    expect(result.current.requests).toContain(globalMocks.request)
  })

  it('should continue all requests', async () => {
    for (let i = 0; i < 10; i++) {
      mockedInterceptor.requests.push({ ...globalMocks.request, id: `${i}` })
    }
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequests(), { wrapper })
    await act(() => result.current.continueAllRequests())

    expect(mockedInterceptor.continueRequest).toHaveBeenCalledTimes(10)
    for (let i = 0; i < 10; i++) {
      expect(mockedInterceptor.continueRequest).toHaveBeenNthCalledWith(
        i + 1,
        `${i}`
      )
    }
  })
})

describe('[RequestHooks.useRequest]', () => {
  beforeEach(() => {
    mockedInterceptor.requests.push(globalMocks.request)
  })
  afterEach(() => {
    cleanupHooks()
    jest.clearAllMocks()
    mockedInterceptor.requests.splice(0, mockedInterceptor.requests.length)
  })

  it('should throw without a RequestProvider', () => {
    const { result } = renderHook(() => useRequest('request'))
    expect(result.error).toBeDefined()
  })

  it('should return request', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest(globalMocks.request.id), {
      wrapper,
    })

    expect(result.current.request).toMatchObject(globalMocks.request)
  })

  it('should throw on missing request', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest('toto'), { wrapper })

    expect(result.error).toBeDefined()
  })

  it('should add a request to the list on listener', () => {
    let listener: RequestEventListener = () => {
      throw new Error('listener called before subscribe')
    }
    mockedInterceptor.subscribe.mockImplementation((l) => {
      listener = l
      return jest.fn()
    })
    mockedInterceptor.pushRequest.mockImplementation((req) =>
      Interceptor.requests.push(req)
    )
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest('request'), { wrapper })
    actHook(() => {
      mockedInterceptor.pushRequest(globalMocks.request)
      listener(globalMocks.request)
    })

    expect(result.current.request).toEqual(globalMocks.request)
  })

  it('should continue request', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest(globalMocks.request.id), {
      wrapper,
    })

    await actHook(() => result.current.continueRequest())

    expect(mockedInterceptor.continueRequest).toHaveBeenCalledWith(
      globalMocks.request.id
    )
  })

  it('should fail request', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest(globalMocks.request.id), {
      wrapper,
    })

    await actHook(() => result.current.failRequest())

    expect(mockedInterceptor.failRequest).toHaveBeenCalledWith(
      globalMocks.request.id
    )
  })

  it('should update request', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest(globalMocks.request.id), {
      wrapper,
    })

    actHook(() => result.current.updateRequest({ postData: 'toto' }))

    expect(mockedInterceptor.updateRequest).toHaveBeenCalledWith(
      globalMocks.request.id,
      {
        postData: 'toto',
      }
    )
  })

  it('should fulfill request on continue response', async () => {
    mockedInterceptor.requests.push(globalMocks.response)
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <RequestProvider>{children}</RequestProvider>
    )
    const { result } = renderHook(() => useRequest(globalMocks.response.id), {
      wrapper,
    })

    await actHook(() => result.current.continueRequest())

    expect(mockedInterceptor.fulfillRequest).toHaveBeenCalledWith(
      globalMocks.response.id
    )
  })
})
