import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { RequestProvider } from '@/interceptor/hooks'

import Sidebar from '../Sidebar'

jest.mock('@/interceptor/hooks')

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
})
