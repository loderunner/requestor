/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, fireEvent, render } from '@testing-library/react'
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

  it('should match snapshots after clicking items', () => {
    const { container, getByRole, getAllByRole } = render(<InterceptList />)

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    expect(container).toMatchSnapshot()

    const items = getAllByRole('listitem')
    expect(items).toBeArrayOfSize(2)

    fireEvent.click(items[0])
    expect(container).toMatchSnapshot()

    fireEvent.click(items[1])
    expect(container).toMatchSnapshot()
  })
})
