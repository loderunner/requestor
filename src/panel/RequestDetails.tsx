import * as cookie from 'cookie'
import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  UnfoldLess as UnfoldLessIcon,
  UnfoldMore as UnfoldMoreIcon,
} from '@/icons'
import { useRequest } from '@/interceptor/hooks'

import AddButton from './components/AddButton'
import ModalInput from './components/ModalInput'

interface SectionValueProps {
  value: string
  editable?: boolean
  onChange?: (v: string) => void
}

const SectionValue = ({
  value,
  onChange,
  editable = false,
}: SectionValueProps) => {
  const [foldable, setFoldable] = useState(false)
  const [folded, setFolded] = useState(true)
  const [showButtons, setShowButtons] = useState(false)
  const [editing, setEditing] = useState(false)
  const spanRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (spanRef.current) {
      setFoldable(spanRef.current.scrollWidth > spanRef.current.clientWidth)
    }
  }, [value])

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
  const onDoubleClick = useCallback(() => {
    if (editable) {
      setEditing(true)
    }
  }, [editable])
  const onChangeInput = useCallback(
    (v: string) => {
      if (onChange !== undefined) {
        onChange(v)
      }
      setEditing(false)
    },
    [onChange]
  )

  return (
    <div
      className="flex overflow-x-hidden space-x-1"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <span className={className} ref={spanRef} onDoubleClick={onDoubleClick}>
        {value}
      </span>
      {unfoldButton}
      {editing && spanRef.current !== null ? (
        <ModalInput
          element={spanRef.current}
          value={value}
          onChange={onChangeInput}
          onCancel={() => setEditing(false)}
        />
      ) : null}
    </div>
  )
}

interface SectionAddProps {
  onChange?: (name: string, value: string) => void
  onCancel?: () => void
}

const SectionAdd = ({ onChange, onCancel }: SectionAddProps) => {
  const [name, setName] = useState('')
  const [step, setStep] = useState<null | 'name' | 'value'>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => setStep('name'), [])

  const nameRef = useRef(null)
  const valueRef = useRef(null)

  return (
    <>
      <span
        className="text-right font-medium text-gray-500 select-none"
        ref={nameRef}
      >
        {name}
      </span>
      {step === 'name' && nameRef.current ? (
        <ModalInput
          element={nameRef.current}
          value=""
          onChange={(v) => {
            setName(v)
            setStep('value')
          }}
          onCancel={onCancel}
        />
      ) : null}
      <span className="w-full" ref={valueRef}>
        {'\u200b'}
      </span>
      {step === 'value' && valueRef.current ? (
        <ModalInput
          element={valueRef.current}
          value=""
          onChange={(v) => {
            if (onChange !== undefined) {
              onChange(name, v)
            }
          }}
          onCancel={onCancel}
        />
      ) : null}
    </>
  )
}

interface SectionProps {
  title: string
  entries: [string, string][]
  editable?: boolean
  onChange?: (name: string, value: string) => void
  onDelete?: (name: string) => void
}

const Section = ({
  title,
  entries,
  onChange,
  editable = false,
}: SectionProps) => {
  const [adding, setAdding] = useState(false)

  const onAdd = useCallback(() => setAdding(true), [])

  const onChangeEntry = useCallback(
    (name: string, value: string) => {
      if (onChange !== undefined) {
        onChange(name, value)
      }
      setAdding(false)
    },
    [onChange]
  )

  const rows = useMemo(
    () =>
      entries.map(([name, value]) => (
        <React.Fragment key={`{title.toLowerCase()}-${name}`}>
          <span className="text-right font-medium text-gray-500 select-none">
            {name}
          </span>
          <SectionValue
            value={value}
            editable={editable}
            onChange={(v: string) => onChangeEntry(name, v)}
          />
        </React.Fragment>
      )),
    [editable, entries, onChangeEntry]
  )

  return (
    <>
      <span className="text-lg font-semibold col-span-2 mt-4 select-none">
        {title}
      </span>
      {rows}
      {editable && !adding ? (
        <div className="relative col-span-2">
          <AddButton onClick={onAdd} />
        </div>
      ) : null}
      {adding ? <SectionAdd onChange={onChangeEntry} /> : null}
    </>
  )
}

interface Props {
  className?: string
  requestId: string
}

const RequestDetails = ({ requestId, className = '' }: Props) => {
  const { request, updateRequest } = useRequest(requestId)
  const url = useMemo(() => new URL(request.url), [request.url])

  const onChangeQuery = useCallback(
    (name: string, value: string) => {
      const searchParams = url.searchParams
      searchParams.set(name, value)
      url.search = searchParams.toString()
      updateRequest({ url: url.toString() })
    },
    [updateRequest, url]
  )

  const querySection = useMemo(() => {
    const searchParams = [...url.searchParams]
    return (
      <Section
        title="Query"
        entries={searchParams}
        editable
        onChange={onChangeQuery}
      ></Section>
    )
  }, [onChangeQuery, url.searchParams])

  const onChangeHeader = useCallback(
    (name: string, value: string) => {
      updateRequest({ headers: { ...request.headers, [name]: value } })
    },
    [request.headers, updateRequest]
  )

  const headerSection = useMemo(() => {
    const headers = Object.entries(request.headers).filter(
      ([headerName]) => headerName.toLowerCase() !== 'cookie'
    )
    return (
      <Section
        title="Headers"
        entries={headers}
        editable
        onChange={onChangeHeader}
      ></Section>
    )
  }, [onChangeHeader, request.headers])

  const cookieSection = useMemo(() => {
    const cookieHeader = Object.entries(request.headers).find(
      ([headerName]) => headerName.toLowerCase() === 'cookie'
    )
    const cookies: ReturnType<typeof cookie.parse> = cookieHeader
      ? cookie.parse(cookieHeader[1])
      : {}

    return (
      <Section
        title="Cookies"
        entries={[...Object.entries(cookies)]}
        editable={false}
      ></Section>
    )
  }, [request.headers])

  return (
    <div className={className}>
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
        {/* Sections */}
        {querySection}
        {headerSection}
        {cookieSection}
      </div>
    </div>
  )
}

export default RequestDetails
