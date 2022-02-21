import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import RequestDetails from '../RequestDetails'

jest.mock('@/interceptor/hooks')

describe('[RequestDetails]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <RequestDetails request={globalMocks.request} />
    )
    expect(container).toMatchSnapshot()
  })
})
