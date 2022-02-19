import { act, cleanup, renderHook } from '@testing-library/react-hooks'

import { useSelection } from '..'

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

    act(() => result.current.setSelection(globalMocks.intercept))

    expect(result.current.selection).toBe(globalMocks.intercept)
    expect(result.current.selectionType).toBe('intercept')
  })

  it('should set request selection', async () => {
    const { result } = renderHook(() => useSelection())

    act(() => result.current.setSelection(globalMocks.request))

    expect(result.current.selection).toBe(globalMocks.request)
    expect(result.current.selectionType).toBe('request')
  })

  it('should cycle between selections', async () => {
    const { result } = renderHook(() => useSelection())

    act(() => result.current.setSelection(globalMocks.intercept))
    expect(result.current.selection).toBe(globalMocks.intercept)
    expect(result.current.selectionType).toBe('intercept')

    act(() => result.current.setSelection(globalMocks.request))
    expect(result.current.selection).toBe(globalMocks.request)
    expect(result.current.selectionType).toBe('request')

    act(() => result.current.setSelection(null))
    expect(result.current.selection).toBeNull()
    expect(result.current.selectionType).toBe('null')
  })
})
