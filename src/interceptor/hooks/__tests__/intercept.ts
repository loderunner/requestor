import { act, cleanup, renderHook } from '@testing-library/react-hooks'

import { useIntercept, useIntercepts } from '..'
import * as Interceptor from '../../intercept'

import type { Intercept } from '../../intercept'

jest.mock('../../intercept')
const mockedInterceptor = Interceptor as jest.Mocked<typeof Interceptor>

const inter = { id: 'inter', pattern: 'helloworld', enabled: true }

const mockInterceptor = () => {
  ;(mockedInterceptor.intercepts as Interceptor.Intercept[]).splice(
    0,
    mockedInterceptor.intercepts.length
  )

  mockedInterceptor.addIntercept.mockImplementation((i) => {
    ;(mockedInterceptor.intercepts as Interceptor.Intercept[]).push(i)
    return i
  })

  mockedInterceptor.removeIntercept.mockImplementation((i) =>
    (mockedInterceptor.intercepts as Interceptor.Intercept[]).splice(
      mockedInterceptor.intercepts.findIndex((j) => j.id === i),
      1
    )
  )

  mockedInterceptor.getIntercept.mockImplementation(() => inter)
  mockedInterceptor.updateIntercept.mockImplementation(() => inter)
}

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

    act(() => {
      result.current.addIntercept(inter)
    })

    expect(mockedInterceptor.addIntercept).toHaveBeenCalledWith(inter)
    expect(result.current.intercepts).toBeArrayOfSize(1)
  })

  it('should remove intercept', () => {
    const { result } = renderHook(() => useIntercepts())

    act(() => result.current.removeIntercept('toto'))

    expect(mockedInterceptor.removeIntercept).toHaveBeenCalledWith('toto')
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
    const { result } = renderHook(() => useIntercept('inter'))

    expect(result.error).toBeDefined()
  })

  it('shoud use intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    let i: Intercept
    act(() => {
      i = interceptsResult.current.addIntercept(inter)
    })

    const { result } = renderHook(() => useIntercept(i.id as string))

    expect(result.error).toBeUndefined()
    expect(result.current.intercept).toBe(inter)
  })

  it('shoud throw on missing intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    act(() => {
      interceptsResult.current.addIntercept(inter)
    })

    const { result } = renderHook(() => useIntercept('toto'))

    expect(result.error).toBeDefined()
  })

  it('shoud update intercept', () => {
    const { result: interceptsResult } = renderHook(() => useIntercepts())

    let i: Intercept
    act(() => {
      i = interceptsResult.current.addIntercept(inter)
    })

    const { result } = renderHook(() => useIntercept(i.id as string))

    const inter2 = { pattern: 'helloworld', enabled: false }
    act(() => result.current.setIntercept(inter2))

    expect(interceptsResult.current.intercepts).toBeArrayOfSize(1)
    expect(mockedInterceptor.updateIntercept).toHaveBeenCalledWith(
      expect.any(String),
      inter2
    )
  })
})
