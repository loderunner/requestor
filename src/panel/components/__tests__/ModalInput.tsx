import { cleanup, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import '@testing-library/jest-dom'

import ModalInput from '../ModalInput'

describe('[ModalInput]', () => {
  const onChange = jest.fn()
  const onCancel = jest.fn()
  beforeEach(() => {
    jest.resetAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', async () => {
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { container, findByRole } = render(
      <ModalInput
        element={spanContainer}
        value=""
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    await findByRole('textbox')

    expect(container).toMatchSnapshot()
  })

  it('should have focus and be selected', async () => {
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    const input = (await findByRole('textbox')) as HTMLInputElement

    expect(input).toHaveValue('toto')
    expect(input).toHaveFocus()
    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe(4)
  })

  it('should change value on change event', async () => {
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    const input = (await findByRole('textbox')) as HTMLInputElement

    fireEvent.change(input, { target: { value: 'hello world' } })

    expect(input).toHaveValue('hello world')
  })

  it('should change value on keyboard events', async () => {
    const user = userEvent.setup()
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    const input = (await findByRole('textbox')) as HTMLInputElement

    await user.keyboard('hello world')

    expect(input).toHaveValue('hello world')
  })

  it('should fire onChange event on blur', async () => {
    const user = userEvent.setup()
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    await findByRole('textbox')

    await user.keyboard('hello world')
    await user.click(spanContainer as HTMLSpanElement)

    expect(onChange).toBeCalledWith('hello world')
    expect(onCancel).not.toBeCalled()
  })

  it('should fire onChange event on Enter key down', async () => {
    const user = userEvent.setup()
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    await findByRole('textbox')

    await user.keyboard('hello world')
    await user.keyboard('{Enter}')

    expect(onChange).toBeCalledWith('hello world')
    expect(onCancel).not.toBeCalled()
  })

  it('should fire onCancel event on Esc key down', async () => {
    const user = userEvent.setup()
    const { container: spanContainer } = render(<span>Hello World!</span>)
    const { findByRole } = render(
      <ModalInput
        element={spanContainer}
        value="toto"
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    await findByRole('textbox')

    await user.keyboard('hello world')
    await user.keyboard('{Esc}')

    expect(onChange).not.toBeCalled()
    expect(onCancel).toBeCalled()
  })
})
