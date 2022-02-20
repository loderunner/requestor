import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import InterceptView from '../InterceptView'

jest.mock('@/interceptor/hooks')

describe('[InterceptView]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(<InterceptView interceptId="inter" />)
    expect(container).toMatchSnapshot()
  })
})
