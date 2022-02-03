import { cleanup, render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import App from '../App'
import * as Requests from '../requests'

jest.mock('../requests')
const mockedRequests = Requests as jest.Mocked<typeof Requests>

describe('[App]', () => {
  afterEach(cleanup)

  it('matches snapshot', () => {
    const { container } = render(<App />)
    expect(container).toMatchSnapshot()
  })

  it('should subscribe and unsubscribe', () => {
    const unsubscribe = jest.fn()
    mockedRequests.subscribe.mockImplementation(() => {
      return unsubscribe
    })
    const { unmount } = render(<App />)

    expect(mockedRequests.subscribe).toBeCalled()

    unmount()

    expect(unsubscribe).toBeCalled()
  })
})
