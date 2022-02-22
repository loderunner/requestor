import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import PlainTextBodyView from '../PlainText'

jest.mock('@/interceptor/hooks')

describe('[RequestBody]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(<PlainTextBodyView data="toto" />)
    expect(container).toMatchSnapshot()
  })
})
