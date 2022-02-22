import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { RequestProvider } from '@/interceptor/hooks'
import * as InterceptorHooks from '@/interceptor/hooks'

import RequestList from '../RequestList'

jest.mock('@/interceptor/hooks')
const mockedHooks = InterceptorHooks as jest.Mocked<typeof InterceptorHooks>

describe('[RequestList]', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should match requestful snapshot', async () => {
    const { container } = render(
      <RequestProvider>
        <RequestList />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('should call continueRequest', async () => {
    const { getByRole } = render(
      <RequestProvider>
        <RequestList />
      </RequestProvider>
    )
    const continueRequestFn =
      mockedHooks.useRequest.mock.results.at(-1)?.value.continueRequest
    const continueButton = getByRole('button', { name: 'Continue request' })
    fireEvent.click(continueButton)
    expect(continueRequestFn).toHaveBeenCalled()
  })
})
