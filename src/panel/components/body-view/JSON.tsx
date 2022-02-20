import * as React from 'react'
import { Fragment, useMemo } from 'react'

import type { CSSProperties } from 'react'

type JSONValue =
  | null
  | boolean
  | number
  | string
  | JSONValue[]
  | { [key: string]: JSONValue }

type PrimitiveValue = null | boolean | number | string

const isPrimitive = (value: JSONValue): value is PrimitiveValue =>
  typeof value === 'boolean' ||
  typeof value === 'number' ||
  typeof value === 'string' ||
  value === null
const isArray = (value: JSONValue): value is JSONValue[] =>
  value instanceof Array
const isObject = (value: JSONValue): value is { [key: string]: JSONValue } =>
  value instanceof Object

interface PrimitiveProps {
  value: PrimitiveValue
}

const PrimitiveView = ({ value }: PrimitiveProps) => {
  switch (typeof value) {
    case 'boolean':
      return <pre>{value}</pre>
    case 'number':
      return <pre>{value}</pre>
    case 'string':
      return <pre>&quot;{value}&quot;</pre>
    case 'object': {
      if (value === null) {
        return <pre>null</pre>
      }
    }
  }
  throw new Error('invalid JSON value')
}

interface ArrayProps {
  array: JSONValue[]
  depth: number
}

const ArrayView = ({ array, depth }: ArrayProps) => {
  const style: CSSProperties = useMemo(
    () => ({ marginLeft: `${depth / 2}rem` }),
    [depth]
  )

  const items: React.ReactNode[] = []
  for (const [i, v] of array.entries()) {
    if (isPrimitive(v)) {
      items.push(
        <div key={i} className="flex" style={style}>
          <span className="text-right">{i}:</span>
          <PrimitiveView value={v} />
        </div>
      )
    } else if (isArray(v)) {
      items.push(
        <div key={i} className="flex" style={style}>
          <span>{i}:</span>
        </div>,
        <ArrayView array={v} depth={depth + 1} />
      )
    } else if (isObject(v)) {
      items.push(
        <div key={i} className="flex" style={style}>
          <span>{i}:</span>
        </div>,
        <ObjectView obj={v} depth={depth + 1} />
      )
    } else {
      throw new Error('invalid JSON value')
    }
  }

  return <>{items}</>
}

interface ObjectProps {
  obj: { [key: string]: JSONValue }
  depth: number
}

const ObjectView = ({ obj, depth }: ObjectProps) => {
  const style: CSSProperties = useMemo(
    () => ({ marginLeft: `${depth / 2}rem` }),
    [depth]
  )

  const items: React.ReactNode[] = []
  for (const [k, v] of Object.entries(obj)) {
    if (isPrimitive(v)) {
      items.push(
        <div key={k} className="flex" style={style}>
          <span className="text-right">{k}:</span>
          <PrimitiveView value={v} />
        </div>
      )
    } else if (isArray(v)) {
      items.push(
        <div key={k} className="flex" style={style}>
          <span>{k}:</span>
        </div>,
        <ArrayView array={v} depth={depth + 1} />
      )
    } else if (isObject(v)) {
      items.push(
        <div key={k} className="flex" style={style}>
          <span>{k}:</span>
        </div>,
        <ObjectView obj={v} depth={depth + 1} />
      )
    } else {
      throw new Error('invalid JSON value')
    }
  }

  return <>{items}</>
}

interface Props {
  jsonData: string
}

export const JSONBodyView = ({ jsonData }: Props) => {
  const value = useMemo<JSONValue>(() => JSON.parse(jsonData), [jsonData])
  const view = useMemo(() => {
    if (isPrimitive(value)) {
      return <PrimitiveView value={value} />
    } else if (isArray(value)) {
      return <ArrayView array={value} depth={0} />
    } else if (isObject(value)) {
      return <ObjectView obj={value} depth={0} />
    }
    throw new Error('invalid JSON value')
  }, [value])
  return view
}
