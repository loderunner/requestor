import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { RequestProvider } from '@/interceptor/hooks'

import Sidebar from '../Sidebar'

describe('[Sidebar]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(
      <RequestProvider>
        <Sidebar />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('should match requestful snapshot', async () => {
    const { container } = render(
      <RequestProvider>
        <Sidebar />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
