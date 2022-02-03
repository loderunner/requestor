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
    const wrapper = render(<App />)
    expect(wrapper).toMatchSnapshot()
  })

  it('should subscribe and unsubscribe', () => {
    const unsubscribe = jest.fn()
    mockedRequests.subscribe.mockImplementation(() => {
      return unsubscribe
    })
    render(<App />)

    expect(mockedRequests.subscribe).toBeCalled()

    cleanup()

    expect(unsubscribe).toBeCalled()
  })
})
