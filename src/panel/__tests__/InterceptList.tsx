import { cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import * as React from 'react'
import '@testing-library/jest-dom'

import * as InterceptorHooks from '@/interceptor/hooks'

import InterceptList from '../InterceptList'

import type { Intercept } from '@/interceptor'

jest.mock('@/interceptor/hooks')
const mockedHooks = InterceptorHooks as jest.Mocked<typeof InterceptorHooks>

const mockHooks = () => {
  const intercepts: Intercept[] = []
  mockedHooks.useIntercepts.mockImplementation(() => ({
    intercepts: intercepts as ReadonlyArray<Readonly<Intercept>>,
    addIntercept: jest.fn(() => {
      intercepts.push({
        ...globalMocks.intercept,
        id: `inter-${intercepts.length}`,
      })
      return intercepts.at(-1) ?? globalMocks.intercept
    }),
    removeIntercept: jest.fn(() => {
      intercepts.pop()
    }),
  }))
  mockedHooks.useIntercept.mockImplementation(() => ({
    intercept: globalMocks.intercept,
    updateIntercept: jest.fn(() => globalMocks.intercept),
  }))
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

  it('should add and remove children after clicking buttons', () => {
    const { container, getByRole } = render(<InterceptList />)
    expect(mockedHooks.useIntercepts).toHaveBeenCalled()

    const addButton = getByRole('button', { name: 'Add intercept' })
    fireEvent.click(addButton)
    expect(
      mockedHooks.useIntercepts.mock.results[0].value.addIntercept
    ).toHaveBeenCalled()
    expect(mockedHooks.useIntercept).toHaveBeenCalledWith('inter-0')
    expect(container).toMatchSnapshot()

    const enabledCheckbox = getByRole('checkbox')
    fireEvent.click(enabledCheckbox)
    expect(
      mockedHooks.useIntercept.mock.results[0].value.updateIntercept
    ).toHaveBeenCalled()
    expect(container).toMatchSnapshot()

    const delButton = getByRole('button', { name: 'Delete intercept' })
    fireEvent.click(delButton)
    expect(
      mockedHooks.useIntercepts.mock.results.at(-1)?.value.removeIntercept
    ).toHaveBeenCalledWith('inter')
    expect(container).toMatchSnapshot()
  })

  it('should change selection after clicking items', () => {
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

  it('should show and hide pattern edit modal', async () => {
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
