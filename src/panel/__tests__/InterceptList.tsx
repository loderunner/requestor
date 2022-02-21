import '@testing-library/jest-dom'
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import * as React from 'react'

import * as InterceptorHooks from '@/interceptor/hooks'

import InterceptList from '../InterceptList'

import type { Intercept } from '@/interceptor'

jest.mock('@/interceptor/hooks')
const mockedHooks = InterceptorHooks as jest.Mocked<typeof InterceptorHooks>

describe('InterceptList', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('should match empty snapshot', () => {
    const { container } = render(<InterceptList />)

    expect(container).toMatchSnapshot()
  })

  it('should not show input modal on first render', () => {
    const { queryByRole } = render(<InterceptList />)

    expect(queryByRole('textbox')).toBeNull()
  })

  it('should show input modal on double click', () => {
    let intercepts: Intercept[] = []
    const addIntercept = jest.fn(() => {
      intercepts = [globalMocks.intercept]
      return globalMocks.intercept
    })
    const removeIntercept = jest.fn()
    mockedHooks.useIntercepts.mockImplementation(() => ({
      intercepts,
      addIntercept,
      removeIntercept,
    }))
    const { getByRole, queryByRole } = render(<InterceptList />)

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)

    expect(queryByRole('textbox')).not.toBeNull()
  })

  it('should show input modal on double click', () => {
    const { container, getByRole, queryByRole } = render(<InterceptList />)

    const pauseButton = getByRole('button', { name: 'Pause intercepts' })
    fireEvent.click(pauseButton)

    expect(container).toMatchSnapshot()
  })

  it('should add and remove children after clicking buttons', () => {
    const { container, getByRole } = render(<InterceptList />)
    expect(mockedHooks.useIntercepts).toHaveBeenCalled()

    const addButton = getByRole('button', { name: 'Add intercept' })
    const addInterceptFn =
      mockedHooks.useIntercepts.mock.results.at(-1)?.value.addIntercept
    fireEvent.click(addButton)
    expect(addInterceptFn).toHaveBeenCalled()
    const interceptId = addInterceptFn.mock.results.at(-1)?.value.id
    expect(mockedHooks.useIntercept).toHaveBeenCalledWith(interceptId)
    expect(container).toMatchSnapshot()

    const enabledCheckbox = getByRole('checkbox')
    fireEvent.click(enabledCheckbox)
    expect(
      mockedHooks.useIntercept.mock.results.at(-1)?.value.updateIntercept
    ).toHaveBeenCalled()
    expect(container).toMatchSnapshot()

    const removeInterceptFn =
      mockedHooks.useIntercepts.mock.results.at(-1)?.value.removeIntercept
    const delButton = getByRole('button', { name: 'Delete intercept' })
    fireEvent.click(delButton)
    expect(removeInterceptFn).toHaveBeenCalledWith(interceptId)
    expect(container).toMatchSnapshot()
  })

  it('should change selection after clicking items', () => {
    mockedHooks.useIntercepts.mockImplementation(() => ({
      intercepts: [
        globalMocks.intercept,
        { ...globalMocks.intercept, id: 'helloworld' },
      ],
      addIntercept: () => globalMocks.intercept,
      removeIntercept: () => {},
    }))
    const { container, getAllByRole } = render(<InterceptList />)

    const items = getAllByRole('listitem')
    expect(items).toBeArrayOfSize(2)

    fireEvent.click(items[0])
    expect(container).toMatchSnapshot()

    fireEvent.click(items[1])
    expect(container).toMatchSnapshot()
  })

  it('should show and hide pattern edit modal', async () => {
    const intercepts: Intercept[] = []
    mockedHooks.useIntercepts.mockImplementation(() => ({
      intercepts: intercepts,
      addIntercept: () => {
        intercepts.push(globalMocks.intercept)
        return globalMocks.intercept
      },
      removeIntercept: () => {},
    }))
    const { container, getByRole, findByRole, queryByRole } = render(
      <InterceptList />
    )

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)

    // Textbox should appear on add
    await findByRole('textbox')

    // Losing focus should hide textbox
    const item = getByRole('listitem')
    item.focus()

    await waitFor(() => queryByRole('textbox') === null)

    // Double-clicking pattern should make input appear
    const span = item.querySelector('span') as HTMLSpanElement
    fireEvent.doubleClick(span)

    await findByRole('textbox')

    expect(container).toMatchSnapshot()
  })
})
