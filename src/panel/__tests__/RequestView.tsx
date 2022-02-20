import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import RequestView from '../RequestView'

jest.mock('@/interceptor/hooks')

describe('[RequestView]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <RequestView requestId={globalMocks.request.id} />
    )
    expect(container).toMatchSnapshot()
  })
})
