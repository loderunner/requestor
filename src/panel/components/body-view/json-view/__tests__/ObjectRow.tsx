import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import ObjectRow from '../ObjectRow'

describe('[JSON.ObjectRow]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <ObjectRow
        depth={0}
        k="key"
        v={JSON.parse(globalMocks.request.postData as string)}
        keyEditable
      />
    )
    expect(container).toMatchSnapshot()
  })
})
