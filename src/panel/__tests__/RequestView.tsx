import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import RequestView from '../RequestView'

jest.mock('@/interceptor/hooks')

describe('[RequestView]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match initial snapshot', () => {
    const { container } = render(
      <RequestView requestId={globalMocks.request.id} />
    )
    expect(container).toMatchSnapshot()
  })

  it('should match headers snapshot', () => {
    const { container, getByRole } = render(
      <RequestView requestId={globalMocks.request.id} />
    )

    const headersButton = getByRole('button', { name: 'Headers' })

    fireEvent.click(headersButton)

    expect(container).toMatchSnapshot()
  })

  it('should match body snapshot', () => {
    const { container, getByRole } = render(
      <RequestView requestId={globalMocks.request.id} />
    )

    const bodyButton = getByRole('button', { name: 'Body' })

    fireEvent.click(bodyButton)

    expect(container).toMatchSnapshot()
  })
})
