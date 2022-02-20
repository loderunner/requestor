import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import Main from '../Main'
import * as selection from '../selection'

jest.mock('../selection')
const mockedSelection = selection as jest.Mocked<typeof selection>

jest.mock('@/interceptor/hooks')

describe('[Main]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: null,
      setSelection: () => {},
      selectionType: 'null',
    }))
    const { container } = render(<Main />)

    expect(container).toMatchSnapshot()
  })

  it('should match intercept selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: globalMocks.intercept,
      setSelection: () => {},
      selectionType: 'intercept',
    }))
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })

  it('should match request selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: globalMocks.request,
      setSelection: () => {},
      selectionType: 'request',
    }))
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })
})
