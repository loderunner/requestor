import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import '@testing-library/jest-dom'

import KeyView from '../KeyView'

describe('[JSON.KeyView]', () => {
  afterEach(() => {
    cleanup()
  })
  it('should match initial snapshot', () => {
    const { container } = render(<KeyView name="key" editable={false} />)
    expect(container).toMatchSnapshot()
  })

  it('should open text field on double-click', async () => {
    const user = userEvent.setup()
    const { getByText, queryByRole } = render(
      <KeyView name="key" editable={true} />
    )

    const pre = getByText('key:')

    await user.dblClick(pre)

    const textbox = queryByRole('textbox')
    expect(textbox).not.toBeNull()
    expect(textbox).toHaveValue('key')
  })

  it('should not open text field on double-click if not editable', async () => {
    const user = userEvent.setup()
    const { getByText, queryByRole } = render(
      <KeyView name="key" editable={false} />
    )

    const pre = getByText('key:')

    await user.dblClick(pre)

    const textbox = queryByRole('textbox')
    expect(textbox).toBeNull()
  })

  it('should not show text field on render', async () => {
    const { queryByRole } = render(<KeyView name="key" editable={true} />)

    const textbox = queryByRole('textbox')
    expect(textbox).toBeNull()
  })

  it('should show text field on render with editingInitial', async () => {
    const { queryByRole } = render(
      <KeyView name="key" editable={true} editingInitial={true} />
    )

    const textbox = queryByRole('textbox')
    expect(textbox).not.toBeNull()
  })

  it('should call onChange on close', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const { getByText } = render(
      <KeyView name="key" editable={true} onChange={onChange} />
    )

    const pre = getByText('key:')

    await user.dblClick(pre)
    await user.keyboard('toto{Enter}')

    expect(onChange).toHaveBeenCalledWith('toto')
  })

  it('should call onCancel on Esc', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const onCancel = jest.fn()
    const { getByText } = render(
      <KeyView
        name="key"
        editable={true}
        onChange={onChange}
        onCancel={onCancel}
      />
    )

    const pre = getByText('key:')

    await user.dblClick(pre)
    await user.keyboard('toto{Escape}')

    expect(onChange).not.toHaveBeenCalled()
  })
})
