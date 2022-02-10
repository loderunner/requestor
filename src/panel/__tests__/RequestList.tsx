/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as Interceptor from '@/interceptor'

import RequestList from '../RequestList'

// mock request
const request: Interceptor.Request = {
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[RequestList]', () => {
  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<RequestList requests={[]} />)
    expect(container).toMatchSnapshot()
  })

  it('should match requestful snapshot', async () => {
    const { container } = render(<RequestList requests={[request]} />)
    expect(container).toMatchSnapshot()
  })
})
