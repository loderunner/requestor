import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { RequestProvider } from '@/interceptor/hooks'

import RequestList from '../RequestList'

describe('[RequestList]', () => {
  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should match empty snapshot', () => {
    const { container } = render(
      <RequestProvider>
        <RequestList />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('should match requestful snapshot', async () => {
    const { container } = render(
      <RequestProvider>
        <RequestList />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
