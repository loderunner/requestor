import * as React from 'react'

import Welcome from './Welcome'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => (
  <main id="main" className={`min-h-screen ${className}`}>
    <Welcome />
  </main>
)

export default Main
