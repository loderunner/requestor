import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
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
