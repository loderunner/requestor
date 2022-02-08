import * as React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'

import App from './App'

const container = document.getElementById('app')
if (container === null) {
  throw new Error('could not find #app container element')
}

render(<App />, container)

window.addEventListener('beforeunload', () => {
  unmountComponentAtNode(container)
})
