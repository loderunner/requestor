import { chrome } from 'jest-chrome'

import '../index'

describe('[Background script]', () => {
  it('should create a panel', () => {
    expect(chrome.devtools.panels.create).toBeCalled()
  })
})
