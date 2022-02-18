/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as Interceptor from '@/interceptor'
import { RequestProvider } from '@/interceptor/hooks'

import Sidebar from '../Sidebar'

// mock request
const request: Interceptor.Request = {
  id: 'request',
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[Sidebar]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty snapshot', () => {
    const { container } = render(
      <RequestProvider>
        <Sidebar />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('should match requestful snapshot', async () => {
    const { container } = render(
      <RequestProvider>
        <Sidebar />
      </RequestProvider>
    )
    expect(container).toMatchSnapshot()
  })
})
