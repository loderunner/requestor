import { act, cleanup, renderHook } from '@testing-library/react-hooks'

import { useSelection } from '..'

import type { Intercept, Request } from '@/interceptor'

const inter: Intercept = { pattern: 'helloworld', enabled: true }
const request: Request = {
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[SelectionProvider]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should start with null selection', async () => {
    const { result } = renderHook(() => useSelection())

    expect(result.current.selection).toBeNull()
    expect(result.current.selectionType).toBe('null')
  })

  it('should set intercept selection', async () => {
    const { result } = renderHook(() => useSelection())

    act(() => result.current.setSelection(inter))

    expect(result.current.selection).toBe(inter)
    expect(result.current.selectionType).toBe('intercept')
  })

  it('should set request selection', async () => {
    const { result } = renderHook(() => useSelection())

    act(() => result.current.setSelection(request))

    expect(result.current.selection).toBe(request)
    expect(result.current.selectionType).toBe('request')
  })

  it('should cycle between selections', async () => {
    const { result } = renderHook(() => useSelection())

    act(() => result.current.setSelection(inter))
    expect(result.current.selection).toBe(inter)
    expect(result.current.selectionType).toBe('intercept')

    act(() => result.current.setSelection(request))
    expect(result.current.selection).toBe(request)
    expect(result.current.selectionType).toBe('request')

    act(() => result.current.setSelection(null))
    expect(result.current.selection).toBeNull()
    expect(result.current.selectionType).toBe('null')
  })
})
