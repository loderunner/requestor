import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import '@testing-library/jest-dom'

import AddButton from '../AddButton'

describe('[JSON.AddButton]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(<AddButton />)
    expect(container).toMatchSnapshot()
  })

  it('should match deep snapshot', () => {
    const { container } = render(<AddButton depth={3} />)
    expect(container).toMatchSnapshot()
  })

  it('should call onClick', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const { getByRole } = render(<AddButton onClick={onClick} />)

    const button = getByRole('button')
    await user.click(button)

    expect(onClick).toHaveBeenCalled()
  })
})
