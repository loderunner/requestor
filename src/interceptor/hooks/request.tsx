import {
  Provider as JotaiProvider,
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import React, { useCallback, useLayoutEffect, useMemo } from 'react'

import * as Interceptor from '..'

const requestScope = Symbol('RequestProviderScope')

interface Props {
  children: React.ReactNode
}

const requestsAtom = atom<Interceptor.Request[] | undefined>(undefined)

// Children wrapper to use jotai hooks inside Provider scope
const Children = ({ children }: Props) => {
  const setRequests = useSetAtom(requestsAtom, requestScope)
  useLayoutEffect(() => {
    return Interceptor.subscribe(() => {
      setRequests([...Interceptor.requests])
    })
  }, [setRequests])
  return <>{children}</>
}

export const RequestProvider = ({ children }: Props) => {
  return (
    <JotaiProvider
      scope={requestScope}
      initialValues={[[requestsAtom, [...Interceptor.requests]]]}
    >
      <Children>{children}</Children>
    </JotaiProvider>
  )
}

export const useRequests = () => {
  const requests = useAtomValue(requestsAtom, requestScope)

  if (requests === undefined) {
    throw new Error(
      'no requests in scope\nDid you call useRequests inside a RequestProvider?'
    )
  }

  return requests as ReadonlyArray<Readonly<Interceptor.Request>>
}

export const useRequest = (id: string) => {
  const [requests, setRequests] = useAtom(requestsAtom, requestScope)
  if (requests === undefined) {
    throw new Error(
      'no requests in scope\nDid you call useRequest inside a RequestProvider?'
    )
  }

  const request = useMemo(
    () => requests.find((r) => r.id === id),
    [id, requests]
  )

  const continueRequest = useCallback(async () => {
    await Interceptor.continueRequest(id)
    setRequests([...Interceptor.requests])
  }, [id, setRequests])

  if (request === undefined) {
    throw new Error('request not found')
  }

  return { request: request as Readonly<Interceptor.Request>, continueRequest }
}
