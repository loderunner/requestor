/* eslint-disable @typescript-eslint/ban-types */
import { cleanup, render, waitFor } from '@testing-library/react'
import * as React from 'react'

import {
  Selection,
  Provider as SelectionProvider,
  SelectionType,
  useSelection,
} from '..'

const inter = { pattern: 'helloworld', enabled: true }
const request = {
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[SelectionProvider]', () => {
  let selection: Selection
  let setSelection: Function = () => {
    throw new Error('setSelection called before assignment')
  }
  let selectionType: SelectionType
  const Component = () => {
    ;[selection, setSelection, selectionType] = useSelection()
    return <div>Hello World!</div>
  }

  afterEach(() => {
    cleanup()
  })

  it('should start with null selection', async () => {
    render(
      <SelectionProvider>
        <Component />
      </SelectionProvider>
    )

    expect(selectionType).toBe('null')
    expect(selection).toBeNull()
  })

  it('should set intercept selection', async () => {
    let selection
    let setSelection: Function = () => {
      throw new Error('setSelection called before assignment')
    }
    let selectionType
    const Component = () => {
      ;[selection, setSelection, selectionType] = useSelection()
      return <div>Hello World!</div>
    }

    render(
      <SelectionProvider>
        <Component />
      </SelectionProvider>
    )

    await waitFor(() => setSelection(inter))
    expect(selectionType).toBe('intercept')
    expect(selection).toBe(inter)
  })

  it('should set request selection', async () => {
    render(
      <SelectionProvider>
        <Component />
      </SelectionProvider>
    )

    await waitFor(() => setSelection(request))
    expect(selectionType).toBe('request')
    expect(selection).toBe(request)
  })

  it('should cycle between selections', async () => {
    render(
      <SelectionProvider>
        <Component />
      </SelectionProvider>
    )

    await waitFor(() => setSelection(inter))
    expect(selectionType).toBe('intercept')
    expect(selection).toBe(inter)

    await waitFor(() => setSelection(request))
    expect(selectionType).toBe('request')
    expect(selection).toBe(request)

    await waitFor(() => setSelection(null))
    expect(selectionType).toBe('null')
    expect(selection).toBeNull()
  })
})
