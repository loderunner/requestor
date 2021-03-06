import * as cookie from 'cookie'
import * as React from 'react'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  Circle as CircleIcon,
  Clear as ClearIcon,
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

  const unfoldButton = useMemo(() => {
    if (!foldable) {
      return null
    }

    return (
      <button
        className={`h-4 w-4 p-0.5 rounded-sm bg-slate-400 hover:bg-slate-500 active:bg-slate-600 ${
          showButtons ? '' : 'invisible'
        }`}
      >
        {folded ? (
          <UnfoldMoreIcon className="fill-white" onClick={onUnfold} />
        ) : (
          <UnfoldLessIcon className="fill-white" onClick={onFold} />
        )}
      </button>
    )
  }, [foldable, showButtons, folded, onUnfold, onFold])

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
    <span
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
    </span>
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
        className="text-right font-medium select-none text-gray-500 dark:text-slate-400"
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
  onDelete,
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

  const onDeleteEntry = useCallback(
    (name: string) => {
      if (onDelete !== undefined) {
        onDelete(name)
      }
    },
    [onDelete]
  )

  const rows = useMemo(
    () =>
      entries.map(([name, value]) => (
        <React.Fragment key={`{title.toLowerCase()}-${name}`}>
          <div className="group flex justify-end items-center space-x-1">
            {editable ? (
              <button
                className={`rounded-sm bg-red-500 hover:bg-red-600 active:bg-red-700 opacity-0 group-hover:opacity-100`}
              >
                <ClearIcon
                  className="fill-white"
                  onClick={() => onDeleteEntry(name)}
                />
              </button>
            ) : null}
            <span className="font-medium text-right select-none text-gray-500 dark:text-slate-400">
              {name}
            </span>
          </div>
          <SectionValue
            value={value}
            editable={editable}
            onChange={(v: string) => onChangeEntry(name, v)}
          />
        </React.Fragment>
      )),
    [editable, entries, onChangeEntry, onDeleteEntry]
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
  const isResponse = useMemo(
    () => request.stage === 'Response',
    [request.stage]
  )

  const onChangeQuery = useCallback(
    (name: string, value: string) => {
      const searchParams = url.searchParams
      searchParams.set(name, value)
      url.search = searchParams.toString()
      updateRequest({ url: url.toString() })
    },
    [updateRequest, url]
  )

  const onDeleteQuery = useCallback(
    (name: string) => {
      const searchParams = url.searchParams
      searchParams.delete(name)
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
        editable={!isResponse}
        onChange={onChangeQuery}
        onDelete={onDeleteQuery}
      ></Section>
    )
  }, [isResponse, onChangeQuery, onDeleteQuery, url.searchParams])

  const onChangeHeader = useCallback(
    (name: string, value: string) => {
      updateRequest({ headers: { ...request.headers, [name]: value } })
    },
    [request.headers, updateRequest]
  )

  const onDeleteHeader = useCallback(
    (name: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [name]: _, ...headers } = request.headers
      updateRequest({ headers })
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
        onDelete={onDeleteHeader}
      ></Section>
    )
  }, [onChangeHeader, onDeleteHeader, request.headers])

  const cookieSection = useMemo(() => {
    if (isResponse) {
      return null
    }

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
  }, [isResponse, request.headers])

  const onChangeURL = useCallback(
    (value: string) => {
      const newURL = new URL(value)
      newURL.search = url.search
      updateRequest({ url: newURL.toString() })
    },
    [updateRequest, url.search]
  )

  const onChangeMethod = useCallback(
    (method: string) => updateRequest({ method }),
    [updateRequest]
  )

  const iconColor = useMemo(() => {
    if (request.stage === 'Response') {
      const statusCode = request.statusCode ?? 0
      if (statusCode >= 200 && statusCode < 300) {
        return 'fill-green-600'
      } else if (statusCode >= 300 && statusCode < 400) {
        return 'fill-indigo-600'
      } else if (statusCode >= 400 && statusCode < 500) {
        return 'fill-yellow-500'
      } else if (statusCode >= 500 && statusCode < 600) {
        return 'fill-red-600'
      }
    }
    return ''
  }, [request.stage, request.statusCode])

  const onChangeStatusCode = useCallback(
    (statusCode: string) => {
      if (request.stage !== 'Response') {
        throw new Error(`cannot change status code at ${request.stage} stage`)
      }
      const code = parseInt(statusCode)
      if (Number.isNaN(code)) {
        throw new Error('invalid status code')
      }
      updateRequest({ statusCode: code })
    },
    [request.stage, updateRequest]
  )

  return (
    <div className={className}>
      <span className="text-3xl font-bold">{url.host}</span>
      <div className="my-8 grid grid-cols-[10rem_1fr] gap-x-4 gap-y-1">
        {/* Response status */}
        {isResponse ? (
          <>
            <span className="text-right font-medium select-none text-gray-500 dark:text-slate-400">
              Status
            </span>
            <div className="inline-flex items-center space-x-1">
              <span>
                <CircleIcon className={`h-full w-auto ${iconColor}`} />
              </span>
              <SectionValue
                value={`${request.statusCode}`}
                editable
                onChange={onChangeStatusCode}
              />
            </div>
          </>
        ) : null}
        {/* URL */}
        <span className="text-right font-medium select-none text-gray-500 dark:text-slate-400">
          URL
        </span>
        <SectionValue
          value={`${url.origin}${url.pathname}`}
          editable={!isResponse}
          onChange={onChangeURL}
        />
        {/* Method */}
        <span className="text-right font-medium select-none text-gray-500 dark:text-slate-400">
          Method
        </span>
        <SectionValue
          value={request.method}
          editable={!isResponse}
          onChange={onChangeMethod}
        />
        {/* Sections */}
        {querySection}
        {headerSection}
        {cookieSection}
      </div>
    </div>
  )
}

export default RequestDetails
