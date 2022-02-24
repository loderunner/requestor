import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import '@testing-library/jest-dom'

import JSONBodyView from '../JSON'

jest.mock('@/interceptor/hooks')

describe('[RequestBody]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <JSONBodyView jsonData={globalMocks.request.postData as string} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should call onChange', async () => {
    const user = userEvent.setup()
    const jsonData = JSON.stringify({ hello: 'world' })
    const onChange = jest.fn()
    const { container, getByText } = render(
      <JSONBodyView jsonData={jsonData} onChange={onChange} />
    )

    const prop = getByText('"world"')
    await user.dblClick(prop)
    await user.keyboard('"toto"')
    await user.click(container)

    expect(onChange).toHaveBeenCalledWith(JSON.stringify({ hello: 'toto' }))
  })
})
