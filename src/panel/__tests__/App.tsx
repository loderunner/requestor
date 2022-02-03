/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'

import App from '../App'
import * as Requests from '../requests'

jest.mock('../requests')
const mockedRequests = Requests as jest.Mocked<typeof Requests>

describe('[App]', () => {
  const unsubscribe = jest.fn()
  beforeEach(() => {
    mockedRequests.subscribe.mockImplementation(() => {
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

    expect(mockedRequests.subscribe).toBeCalled()

    unmount()

    expect(unsubscribe).toBeCalled()
  })

  it('should update after callback', () => {
    let listener: Requests.RequestEventListener = () => {
      throw new Error('listener called before subscribe')
    }
    mockedRequests.subscribe.mockImplementation((l) => {
      listener = l
      return unsubscribe
    })

    const { container } = render(<App />)

    const snapshot = container.cloneNode(true)

    const req = {
      method: 'GET',
      url: 'https://example.com',
    } as Requests.Request
    listener(req)

    expect(container).not.toEqual(snapshot)
  })
})
