/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import Main from '../Main'

describe('[Main]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })
})
