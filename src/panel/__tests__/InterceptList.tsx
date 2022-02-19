import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

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

  it('should add and remove children after clicking buttons', () => {
    const { container, getByRole } = render(<InterceptList />)
    expect(mockedHooks.useIntercepts).toHaveBeenCalled()

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    const addInterceptFn =
      mockedHooks.useIntercepts.mock.results[0].value.addIntercept
    expect(addInterceptFn).toHaveBeenCalled()
    const interceptId = addInterceptFn.mock.results[0].value.id
    expect(mockedHooks.useIntercept).toHaveBeenCalledWith(interceptId)
    expect(container).toMatchSnapshot()

    const enabledCheckbox = getByRole('checkbox')
    fireEvent.click(enabledCheckbox)
    expect(
      mockedHooks.useIntercept.mock.results[0].value.updateIntercept
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
