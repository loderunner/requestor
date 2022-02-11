import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import { useEffect } from 'react'

import { InterceptProvider, useIntercepts } from '..'
import * as Interceptor from '../..'

jest.mock('../..')
const mockedInterceptor = Interceptor as jest.Mocked<typeof Interceptor>

const inter = { pattern: 'helloworld', enabled: true }

describe('[InterceptReact]', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  afterEach(() => {
    cleanup()
  })

  it('should add intercept', () => {
    const Component = () => {
      const { addIntercept } = useIntercepts()
      useEffect(() => {
        addIntercept(inter)
      }, [])
      return <div>Hello World!</div>
    }

    render(
      <InterceptProvider>
        <Component />
      </InterceptProvider>
    )

    expect(mockedInterceptor.addIntercept).toHaveBeenCalledWith(inter)
  })

  it('should add intercept', () => {
    const Component = () => {
      const { removeIntercept } = useIntercepts()
      useEffect(() => {
        removeIntercept(inter)
      }, [])
      return <div>Hello World!</div>
    }

    render(
      <InterceptProvider>
        <Component />
      </InterceptProvider>
    )

    expect(mockedInterceptor.removeIntercept).toHaveBeenCalledWith(inter)
  })
})
