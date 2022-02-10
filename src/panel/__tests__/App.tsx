/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as Intercept from '@/intercept'

import App from '../App'

jest.mock('@/intercept')
const mockedIntercept = Intercept as jest.Mocked<typeof Intercept>

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

  it('should update after callback', async () => {
    let listener: Intercept.RequestEventListener = () => {
      throw new Error('listener called before subscribe')
    }
    mockedIntercept.subscribe.mockImplementation((l) => {
      listener = l
      return unsubscribe
    })

    const { container } = render(<App />)

    const snapshot = container.cloneNode(true)

    const req = {
      method: 'GET',
      url: 'https://example.com',
    } as Intercept.Request
    await waitFor(() => listener(req))

    expect(container).not.toEqual(snapshot)
    expect(container).toMatchSnapshot()
  })
})
