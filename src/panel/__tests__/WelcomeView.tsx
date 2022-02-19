import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import WelcomeView from '../WelcomeView'

describe('[WelcomeView]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<WelcomeView />)
    expect(container).toMatchSnapshot()
  })

  it('should click button', () => {
    const { container, getByRole } = render(<WelcomeView />)
    const button = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(button)

    expect(container).toMatchSnapshot()
  })
})
