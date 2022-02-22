import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import JSONBodyView from '../JSON'

jest.mock('@/interceptor/hooks')

describe('[RequestBody]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <JSONBodyView jsonData={globalMocks.request.postData as string} />
    )
    expect(container).toMatchSnapshot()
  })
})
