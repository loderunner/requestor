import * as React from 'react'

interface Props {
  className?: string
}

const Main = ({ className }: Props) => (
  <main id="Main" className={className}>
    Hello World!
  </main>
)

export default Main
