/* eslint-disable @typescript-eslint/ban-ts-comment */
import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as InterceptorHooks from '@/interceptor/hooks'

import InterceptList from '../InterceptList'

import type { Intercept } from '@/interceptor'

jest.mock('@/interceptor/hooks')
const mockedHooks = InterceptorHooks as jest.Mocked<typeof InterceptorHooks>

const inter = { id: 'inter', pattern: 'helloworld', enabled: true }

const mockHooks = () => {
  const intercepts: Intercept[] = []
  mockedHooks.useIntercepts.mockImplementation(() => {
    return {
      intercepts: intercepts as ReadonlyArray<Readonly<Intercept>>,
      addIntercept: jest.fn(() => {
        intercepts.push(inter)
        return inter
      }),
      removeIntercept: jest.fn(() => {
        intercepts.pop()
      }),
    }
  })
  mockedHooks.useIntercept.mockImplementation(() => {
    return {
      intercept: inter,
      updateIntercept: jest.fn(() => inter),
    }
  })
}

describe('InterceptList', () => {
  beforeEach(() => {
    mockHooks()
  })
  afterEach(() => {
    cleanup()
    jest.resetAllMocks()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<InterceptList />)
    expect(container).toMatchSnapshot()
  })

  it('should match snapshots after clicking buttons', () => {
    const { container, getByRole } = render(<InterceptList />)
    expect(mockedHooks.useIntercepts).toHaveBeenCalled()

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    expect(
      mockedHooks.useIntercepts.mock.results[0].value.addIntercept
    ).toHaveBeenCalled()
    expect(container).toMatchSnapshot()

    const enabledCheckbox = getByRole('checkbox')
    fireEvent.click(enabledCheckbox)
    expect(container).toMatchSnapshot()

    const delButton = getByRole('button', { name: 'Delete intercept' })
    fireEvent.click(delButton)
    expect(container).toMatchSnapshot()
  })

  it('should match snapshots after clicking items', () => {
    const { container, getByRole, getAllByRole } = render(<InterceptList />)

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    fireEvent.click(addButton)
    expect(container).toMatchSnapshot()

    const items = getAllByRole('listitem')
    expect(items).toBeArrayOfSize(2)

    fireEvent.click(items[0])
    expect(container).toMatchSnapshot()

    fireEvent.click(items[1])
    expect(container).toMatchSnapshot()
  })

  it('should match snapshot after double click', () => {
    const { container, getByRole } = render(<InterceptList />)

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    const item = getByRole('listitem')
    fireEvent.doubleClick(item)

    expect(container).toMatchSnapshot()
  })
})
