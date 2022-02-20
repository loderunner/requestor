import * as cookie from 'cookie'
import * as React from 'react'
import { useMemo } from 'react'

import { useRequest } from '@/interceptor/hooks'

interface SectionProps {
  title: string
  entries: [string, string][]
}

const Section = ({ title, entries }: SectionProps) => {
  const rows = useMemo(
    () =>
      entries.map(([name, value]) => (
        <React.Fragment key={`{title.toLowerCase()}-${name}`}>
          <span className="text-right font-medium text-gray-500">{name}</span>
          <span className="text-ellipsis overflow-x-hidden whitespace-nowrap">
            {value}
          </span>
        </React.Fragment>
      )),
    [entries]
  )

  return (
    <>
      <span className="text-lg font-semibold col-span-2 mt-4">{title}</span>
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
        <span className="text-right font-medium text-gray-500">URL</span>
        <span>{`${url.origin}${url.pathname}`}</span>
        {/* Method */}
        <span className="text-right font-medium text-gray-500">Method</span>
        <span>{request.method}</span>
        {querySection}
        {headerSection}
        {cookieSection}
      </div>
    </div>
  )
}

export default RequestView
