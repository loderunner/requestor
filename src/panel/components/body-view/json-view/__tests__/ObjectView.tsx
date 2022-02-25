import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import ObjectView from '../ObjectView'

describe('[JSON.ObjectView]', () => {
  afterEach(() => {
    cleanup()
  })
  it('should match initial snapshot', () => {
    const { container } = render(
      <ObjectView
        obj={JSON.parse(globalMocks.request.postData as string)}
        depth={0}
        folded={false}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
