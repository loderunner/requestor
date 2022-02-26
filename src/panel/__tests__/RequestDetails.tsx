import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as InterceptorHooks from '@/interceptor/hooks'

import RequestDetails from '../RequestDetails'

jest.mock('@/interceptor/hooks')
const mockedHooks = InterceptorHooks as jest.Mocked<typeof InterceptorHooks>

describe('[RequestDetails]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <RequestDetails requestId={globalMocks.request.id} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should update request URL', async () => {
    const user = userEvent.setup()
    const { getByText } = render(
      <RequestDetails requestId={globalMocks.request.id} />
    )

    const queryVariable = getByText('toto')

    const updateRequestFn =
      mockedHooks.useRequest.mock.results.at(-1)?.value.updateRequest
    await user.dblClick(queryVariable)
    await user.keyboard('hello{Enter}')

    expect(updateRequestFn).toHaveBeenCalledWith({
      url: expect.stringContaining('q=hello'),
    })
  })

  it('should update headers', async () => {
    const user = userEvent.setup()
    const { getByText } = render(
      <RequestDetails requestId={globalMocks.request.id} />
    )

    const queryVariable = getByText('application/json')

    const updateRequestFn =
      mockedHooks.useRequest.mock.results.at(-1)?.value.updateRequest
    await user.dblClick(queryVariable)
    await user.keyboard('text/plain{Enter}')

    expect(updateRequestFn).toHaveBeenCalledWith({
      headers: expect.objectContaining({ 'Content-Type': 'text/plain' }),
    })
  })

  it('should not be able to update cookies', async () => {
    const user = userEvent.setup()
    const { getByText, queryByRole } = render(
      <RequestDetails requestId={globalMocks.request.id} />
    )

    const queryVariable = getByText('2022-02-20-16')

    await user.dblClick(queryVariable)

    expect(queryByRole('textbox')).toBeNull()
  })

  it('should update method', async () => {
    const user = userEvent.setup()
    const { getByText } = render(
      <RequestDetails requestId={globalMocks.request.id} />
    )

    const queryVariable = getByText('POST')

    const updateRequestFn =
      mockedHooks.useRequest.mock.results.at(-1)?.value.updateRequest
    await user.dblClick(queryVariable)
    await user.keyboard('PUT{Enter}')

    expect(updateRequestFn).toHaveBeenCalledWith({
      method: 'PUT',
    })
  })
})
