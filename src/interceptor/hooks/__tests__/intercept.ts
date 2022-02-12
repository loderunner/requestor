import { act, cleanup, renderHook } from '@testing-library/react-hooks'

import { useIntercept, useIntercepts } from '..'
import * as Interceptor from '../../intercept'

jest.mock('../../intercept')
const mockedInterceptor = Interceptor as jest.Mocked<typeof Interceptor>

const mockInterceptor = () => {
  ;(mockedInterceptor.intercepts as Interceptor.Intercept[]).splice(
    0,
    mockedInterceptor.intercepts.length
  )

  mockedInterceptor.addIntercept.mockImplementation((i) =>
    (mockedInterceptor.intercepts as Interceptor.Intercept[]).push(i)
  )

  mockedInterceptor.removeIntercept.mockImplementation((i) =>
    (mockedInterceptor.intercepts as Interceptor.Intercept[]).splice(
      mockedInterceptor.intercepts.findIndex((j) => j === i),
      1
    )
  )
}

const inter = { pattern: 'helloworld', enabled: true }
const inter2 = { pattern: 'helloworld', enabled: true }

describe('[InterceptHooks.useIntercepts]', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockInterceptor()
  })
  afterEach(() => {
    cleanup()
  })

  it('shoud use intercepts', () => {
    const { result } = renderHook(() => useIntercepts())

    expect(result.current.intercepts).toBeArrayOfSize(0)
  })

  it('should add intercept', () => {
    const { result } = renderHook(() => useIntercepts())

    act(() => result.current.addIntercept(inter))

    expect(mockedInterceptor.addIntercept).toHaveBeenCalledWith(inter)
    expect(result.current.intercepts).toBeArrayOfSize(1)
  })

  it('should remove intercept', () => {
    const { result } = renderHook(() => useIntercepts())

    act(() => result.current.removeIntercept(inter))

    expect(mockedInterceptor.removeIntercept).toHaveBeenCalledWith(inter)
  })
})

describe('[InterceptHooks.useIntercept]', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockInterceptor()
  })
  afterEach(() => {
    cleanup()
  })

  it('shoud fail on empty intercepts', () => {
    const { result } = renderHook(() => useIntercept(inter))

    expect(result.error).toBeDefined()
  })

  it('shoud use intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    act(() => interceptsResult.current.addIntercept(inter))

    const { result } = renderHook(() => useIntercept(inter))

    expect(result.error).toBeUndefined()
    expect(result.current.intercept).toBe(inter)
  })

  it('shoud throw on missing intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    act(() => interceptsResult.current.addIntercept(inter))

    const { result } = renderHook(() => useIntercept(inter2))

    expect(result.error).toBeDefined()
  })

  it('shoud update intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    act(() => interceptsResult.current.addIntercept(inter))

    let i = inter
    const { result } = renderHook(() => useIntercept(i))

    i = inter2
    act(() => result.current.setIntercept(i))

    expect(interceptsResult.current.intercepts).toBeArrayOfSize(1)
    expect(result.current.intercept).toBe(inter2)
  })

  it('shoud remove intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    act(() => interceptsResult.current.addIntercept(inter))

    const { result } = renderHook(() => useIntercept(inter))

    act(() => result.current.removeIntercept())

    expect(interceptsResult.current.intercepts).toBeArrayOfSize(0)
  })
})
