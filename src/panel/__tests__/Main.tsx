/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import Main from '../Main'
import * as selection from '../selection'

jest.mock('../selection')
const mockedSelection = selection as jest.Mocked<typeof selection>

describe('[Main]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => [
      null,
      () => {},
      'null',
    ])
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })

  it('should match intercept selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => [
      { pattern: 'helloworld', enabled: true },
      () => {},
      'intercept',
    ])
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })

  it('should match request selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => [
      {
        headers: {},
        initialPriority: 'Medium',
        method: 'GET',
        referrerPolicy: 'same-origin',
        url: 'https://example.com',
      },
      () => {},
      'request',
    ])
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })
})
