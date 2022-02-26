import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import PrimitiveRow from '../PrimitiveRow'

describe('[JSON.PrimitiveRow]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <PrimitiveRow depth={0} k="key" v={null} keyEditable />
    )
    expect(container).toMatchSnapshot()
  })
})
