import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'

import PlainTextBodyView from '../PlainText'

jest.mock('@/interceptor/hooks')

describe('[RequestBody]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(<PlainTextBodyView data="toto" />)
    expect(container).toMatchSnapshot()
  })

  it('should have content editable', async () => {
    const user = userEvent.setup()
    const { container, getByRole } = render(<PlainTextBodyView data="toto" />)

    const pre = getByRole('textbox')
    await user.click(pre)
    await user.keyboard('Hello world!')

    expect(container).toHaveTextContent('Hello world!')
  })

  it('should update request', async () => {
    const user = userEvent.setup()
    const onChange = jest.fn()
    const { container, getByRole } = render(
      <PlainTextBodyView data="toto" onChange={onChange} />
    )

    const pre = getByRole('textbox')
    await user.pointer([
      { target: pre, offset: 0, keys: '[MouseLeft>]' },
      { offset: 4 },
    ])
    await user.keyboard('Hello world!')
    await user.click(container)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('Hello world!')
  })
})
