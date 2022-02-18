/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import { act } from 'react-dom/test-utils'

import * as Interceptor from '@/interceptor'

import App from '../App'

jest.mock('@/interceptor')
const mockedIntercept = Interceptor as jest.Mocked<typeof Interceptor>

// mock request
const request: Interceptor.Request = {
  id: 'request',
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

describe('[App]', () => {
  const unsubscribe = jest.fn()
  beforeEach(() => {
    mockedIntercept.subscribe.mockImplementation(() => {
      return unsubscribe
    })
  })
  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('matches snapshot', () => {
    const { container } = render(<App />)
    expect(container).toMatchSnapshot()
  })

  it('should subscribe and unsubscribe', () => {
    const { unmount } = render(<App />)

    expect(mockedIntercept.subscribe).toBeCalled()

    unmount()

    expect(unsubscribe).toBeCalled()
  })
})
