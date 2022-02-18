/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as Interceptor from '@/interceptor'

import App from '../App'

jest.mock('@/interceptor')
const mockedIntercept = Interceptor as jest.Mocked<typeof Interceptor>

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
