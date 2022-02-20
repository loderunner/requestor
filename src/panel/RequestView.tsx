import * as cookie from 'cookie'
import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  Copy as CopyIcon,
  UnfoldLess as UnfoldLessIcon,
  UnfoldMore as UnfoldMoreIcon,
} from '@/icons'
import { useRequest } from '@/interceptor/hooks'

const SectionValue = ({ value }: { value: string }) => {
  const [foldable, setFoldable] = useState(false)
  const [folded, setFolded] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (spanRef.current) {
      setFoldable(spanRef.current.scrollWidth > spanRef.current.clientWidth)
    }
  }, [spanRef])

  const className = useMemo(() => {
    if (folded) {
      return 'text-ellipsis overflow-x-hidden whitespace-nowrap'
    } else {
      return 'break-all'
    }
  }, [folded])

  const onFold = useCallback(() => setFolded(true), [])
  const onUnfold = useCallback(() => setFolded(false), [])

  const buttonClassName = useMemo(() => {
    let className =
      'h-4 w-4 p-0.5 rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-600'
    if (!showButtons) {
      className += ' invisible'
    }
    return className
  }, [showButtons])

  const unfoldButton = useMemo(() => {
    if (!foldable) {
      return null
    }

    return (
      <button className={buttonClassName}>
        {folded ? (
          <UnfoldMoreIcon className="fill-white" onClick={onUnfold} />
        ) : (
          <UnfoldLessIcon className="fill-white" onClick={onFold} />
        )}
      </button>
    )
  }, [foldable, folded, buttonClassName, onFold, onUnfold])

  const onHoverStart = useCallback(() => setShowButtons(true), [])
  const onHoverEnd = useCallback(() => setShowButtons(false), [])

  return (
    <div
      className="flex overflow-x-hidden space-x-1"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <span className={className} ref={spanRef}>
        {value}
      </span>
      {unfoldButton}
    </div>
  )
}

interface SectionProps {
  title: string
  entries: [string, string][]
}

const Section = ({ title, entries }: SectionProps) => {
  const rows = useMemo(
    () =>
      entries.map(([name, value]) => (
        <React.Fragment key={`{title.toLowerCase()}-${name}`}>
          <span className="text-right font-medium text-gray-500 select-none">
            {name}
          </span>
          <SectionValue value={value} />
        </React.Fragment>
      )),
    [entries]
  )

  return (
    <>
      <span className="text-lg font-semibold col-span-2 mt-4 select-none">
        {title}
      </span>
      {rows}
    </>
  )
}

interface Props {
  requestId: string
}

const RequestView = ({ requestId }: Props) => {
  const request = useRequest(requestId)

  const url = useMemo(() => new URL(request.url), [request])

  const querySection = useMemo(() => {
    const searchParams = [...url.searchParams.entries()]
    if (searchParams.length === 0) {
      return null
    }

    return <Section title="Query" entries={searchParams}></Section>
  }, [request])

  const headerSection = useMemo(() => {
    const headers = [...Object.entries(request.headers)].filter(
      ([headerName]) => headerName.toLowerCase() !== 'cookie'
    )
    if (headers.length === 0) {
      return null
    }

    return <Section title="Headers" entries={headers}></Section>
  }, [request])

  const cookieSection = useMemo(() => {
    const cookieHeader = [...Object.entries(request.headers)].find(
      ([headerName]) => headerName.toLowerCase() === 'cookie'
    )
    if (cookieHeader === undefined) {
      return null
    }

    const cookies = cookie.parse(cookieHeader[1])

    return (
      <Section title="Cookies" entries={[...Object.entries(cookies)]}></Section>
    )
  }, [request])

  return (
    <div className="max-w-5xl mx-24 mt-8 px-8 pt-2">
      <span className="text-3xl font-bold">{url.host}</span>
      <div className="my-8 grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1">
        {/* URL */}
        <span className="text-right font-medium text-gray-500 select-none">
          URL
        </span>
        <SectionValue value={`${url.origin}${url.pathname}`} />
        {/* Method */}
        <span className="text-right font-medium text-gray-500 select-none">
          Method
        </span>
        <SectionValue value={request.method} />
        {querySection}
        {headerSection}
        {cookieSection}
      </div>
    </div>
  )
}

export default RequestView
