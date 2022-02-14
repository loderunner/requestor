/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as InterceptorHooks from '@/interceptor/hooks'

import Main from '../Main'
import * as selection from '../selection'

import type { Intercept, Request } from '@/interceptor'

jest.mock('../selection')
const mockedSelection = selection as jest.Mocked<typeof selection>

const inter: Intercept = { id: 'inter', pattern: 'helloworld', enabled: true }
const request: Request = {
  headers: {},
  initialPriority: 'Medium',
  method: 'GET',
  referrerPolicy: 'same-origin',
  url: 'https://example.com',
}

jest.mock('@/interceptor/hooks')
const mockedInterceptorHooks = InterceptorHooks as jest.Mocked<
  typeof InterceptorHooks
>
mockedInterceptorHooks.useIntercepts.mockImplementation(() => ({
  intercepts: [inter],
  addIntercept: jest.fn(),
  removeIntercept: jest.fn(),
}))
mockedInterceptorHooks.useIntercept.mockImplementation(() => ({
  intercept: inter,
  setIntercept: jest.fn(),
  removeIntercept: jest.fn(),
}))

describe('[Main]', () => {
  afterEach(() => {
    cleanup()
  })

  it('should match empty selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: null,
      setSelection: () => {},
      selectionType: 'null',
    }))
    const { container } = render(<Main />)

    expect(container).toMatchSnapshot()
  })

  it('should match intercept selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: inter,
      setSelection: () => {},
      selectionType: 'intercept',
    }))
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })

  it('should match request selection snapshot', () => {
    mockedSelection.useSelection.mockImplementation(() => ({
      selection: request,
      setSelection: () => {},
      selectionType: 'request',
    }))
    const { container } = render(<Main />)
    expect(container).toMatchSnapshot()
  })
})
