/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import InterceptList from '../InterceptList'

describe('[InterceptList]', () => {
  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<InterceptList />)
    expect(container).toMatchSnapshot()
  })

  it('should match snapshots after clicking buttons', () => {
    const { container, getByRole } = render(<InterceptList />)

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    expect(container).toMatchSnapshot()

    const delButton = getByRole('button', { name: 'Delete intercept' })
    fireEvent.click(delButton)
    expect(container).toMatchSnapshot()
  })
})
