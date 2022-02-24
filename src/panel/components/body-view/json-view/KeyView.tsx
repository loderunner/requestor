import * as React from 'react'

interface Props {
  name: string
  editable: boolean
  onChange: ((oldName: string, newName: string) => void) | null
}

const KeyView = ({ name, editable, onChange }: Props) => {
  return <pre className="text-amber-700">{name}:</pre>
}

export default KeyView
