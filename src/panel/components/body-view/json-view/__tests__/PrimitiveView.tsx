import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import '@testing-library/jest-dom'

import PrimitiveView from '../PrimitiveView'

describe('[JSON.PrimitiveView]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match null snapshot', () => {
    const { container } = render(<PrimitiveView value={null} />)
    expect(container).toMatchSnapshot()
  })

  it('should match boolean snapshot', () => {
    const { container } = render(<PrimitiveView value={true} />)
    expect(container).toMatchSnapshot()
  })

  it('should match number snapshot', () => {
    const { container } = render(<PrimitiveView value={11.38} />)
    expect(container).toMatchSnapshot()
  })

  it('should match string snapshot', () => {
    const { container } = render(<PrimitiveView value="Hello World" />)
    expect(container).toMatchSnapshot()
  })

  it('should open text field on double-click', async () => {
    const user = userEvent.setup()
    const value = 'Hello World!'
    const { getByText, queryByRole } = render(<PrimitiveView value={value} />)

    const pre = getByText(JSON.stringify(value))

    await user.dblClick(pre)

    const textbox = queryByRole('textbox')
    expect(textbox).not.toBeNull()
    expect(textbox).toHaveValue(JSON.stringify(value))
  })

  it('should call onChange on close', async () => {
    const user = userEvent.setup()
    const value = 'Hello World!'
    const onChange = jest.fn()
    const { getByText } = render(
      <PrimitiveView value={value} onChange={onChange} />
    )

    const pre = getByText(JSON.stringify(value))

    await user.dblClick(pre)
    await user.keyboard('true{Enter}')

    expect(onChange).toHaveBeenCalledWith(true)
  })
})
