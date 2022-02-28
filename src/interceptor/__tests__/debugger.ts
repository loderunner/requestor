import { chrome } from 'jest-chrome'

import {
  entriesToHeaders,
  headersToEntries,
  listen,
  unlisten,
} from '../debugger'

import type { Protocol } from 'devtools-protocol'

const target = globalMocks.target

describe('[Interceptor.debugger]', () => {
  beforeEach(async () => {
    chrome.debugger.onEvent.clearListeners()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should crash without targets', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) => callback([]))

    await expect(listen()).rejects.toThrow()
  })

  it('should add a listener to debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await listen()

    expect(chrome.debugger.onEvent.hasListeners()).toBeTrue()
  })

  it('should remove the listener from debugger events', async () => {
    chrome.debugger.getTargets.mockImplementation((callback) =>
      callback([target])
    )

    await listen()
    await unlisten()

    expect(chrome.debugger.onEvent.hasListeners()).toBeFalse()
  })
})

describe('[Interceptor.Debugger.headersToEntries]', () => {
  it('should convert Headers object to HeaderEntry[] array', () => {
    const headers: Protocol.Network.Headers = {
      Date: 'Sun, 27 Feb 2022 19:44:34 GMT',
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': '0',
    }

    const entries = headersToEntries(headers)

    expect(entries).toEqual([
      { name: 'Date', value: 'Sun, 27 Feb 2022 19:44:34 GMT' },
      { name: 'Content-Type', value: 'text/html; charset=utf-8' },
      { name: 'Content-Length', value: '0' },
    ])
  })
})

describe('[Interceptor.Debugger.entriesToHeaders]', () => {
  it('should convert HeaderEntry[] array to Headers object', () => {
    const entries: Protocol.Fetch.HeaderEntry[] = [
      { name: 'Date', value: 'Sun, 27 Feb 2022 19:44:34 GMT' },
      { name: 'Content-Type', value: 'text/html; charset=utf-8' },
      { name: 'Content-Length', value: '0' },
    ]

    const headers = entriesToHeaders(entries)

    expect(headers).toEqual({
      Date: 'Sun, 27 Feb 2022 19:44:34 GMT',
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': '0',
    })
  })
})
