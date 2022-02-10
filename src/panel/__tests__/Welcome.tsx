/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import Welcome from '../Welcome'

describe('[Welcome]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<Welcome />)
    expect(container).toMatchSnapshot()
  })

  it('should click button', () => {
    const { container, getByRole } = render(<Welcome />)
    const button = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(button)

    expect(container).toMatchSnapshot()
  })
})
