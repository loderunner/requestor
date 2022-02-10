/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import List from '../List'

describe('[List]', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<List />)
    expect(container).toMatchSnapshot()
  })

  it('should match string header snapshot', () => {
    const header = 'Header title'
    const { container } = render(<List header={header} />)
    expect(container).toMatchSnapshot()
  })

  it('should match component header snapshot', () => {
    const header = <div className="header">Header Title</div>
    const { container } = render(<List header={header} />)
    expect(container).toMatchSnapshot()
  })

  it('should match header + string items snapshot', () => {
    const header = 'Header title'
    const items = ['Hello', 'World']
    const { container } = render(<List header={header} items={items} />)
    expect(container).toMatchSnapshot()
  })

  it('should match header + component items snapshot', () => {
    const header = 'Header title'
    const items = [
      <img key="img" src="//image.png"></img>,
      <label key="label">
        <input type="checkbox"></input>Hello World
      </label>,
    ]
    const { container } = render(<List header={header} items={items} />)
    expect(container).toMatchSnapshot()
  })
})
