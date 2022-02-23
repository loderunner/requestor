import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import RequestBody from '../RequestBody'

jest.mock('@/interceptor/hooks')

describe('[RequestBody]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <RequestBody requestId={globalMocks.request.id} />
    )
    expect(container).toMatchSnapshot()
  })
})
