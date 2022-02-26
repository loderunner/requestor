import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import AddRow from '../AddRow'

describe('[JSON.AddRow]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(<AddRow depth={0} />)
    expect(container).toMatchSnapshot()
  })
})
