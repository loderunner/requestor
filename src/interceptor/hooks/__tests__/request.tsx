import {
  act as actHook,
  cleanup as cleanupHooks,
  renderHook,
} from '@testing-library/react-hooks'
import * as React from 'react'

import { RequestProvider, useRequest, useRequests } from '..'
import * as Interceptor from '../../request'

import type { RequestEventListener } from '../../request'

jest.mock('../../request')
const mockedInterceptor = Interceptor as jest.Mocked<typeof Interceptor>

// mock request
const request: Interceptor.Request = {
  id: 'request',
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[RequestHooks.useRequests]', () => {
  afterEach(() => {
    cleanupHooks()
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

    expect(result.current).toBeArrayOfSize(0)
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
      mockedInterceptor.pushRequest(request)
      listener(request)
    })

    expect(result.current).toBeArrayOfSize(1)
    expect(result.current).toContain(request)
  })
})

describe('[RequestHooks.useRequest]', () => {
  afterEach(() => {
    cleanupHooks()
  })

  it('should throw without a RequestProvider', () => {
    const { result } = renderHook(() => useRequest('request'))
    expect(result.error).toBeDefined()
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
      mockedInterceptor.pushRequest(request)
      listener(request)
    })

    expect(result.current).toEqual(request)
  })
})
