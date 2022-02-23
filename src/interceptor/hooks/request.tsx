import {
  Provider as JotaiProvider,
  atom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from 'jotai'
import { atomFamily, splitAtom } from 'jotai/utils'
import React, { useCallback, useLayoutEffect, useMemo } from 'react'

import * as Interceptor from '..'

import type { WritableAtom } from 'jotai'

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

const requestAtom = atomFamily<
  string,
  WritableAtom<Interceptor.Request, Partial<Interceptor.Request>>
>((id: string) =>
  atom(
    (get) => get(requestsAtom)?.find((req) => req.id === id),
    (get, set, arg) => {
      const req = Interceptor.updateRequest(id, arg)
      set(requestsAtom, [...Interceptor.requests])
      return req
    }
  )
)
requestAtom.setShouldRemove(
  (createdAt: number, id: string) =>
    Interceptor.requests.find((req) => req.id === id) === undefined
)

export const useRequest = (id: string) => {
  const [requests, setRequests] = useAtom(requestsAtom, requestScope)
  if (requests === undefined) {
    throw new Error(
      'no requests in scope\nDid you call useRequest inside a RequestProvider?'
    )
  }

  const [request, setRequest] = useAtom(requestAtom(id), requestScope)

  if (request === undefined) {
    throw new Error('request not found')
  }

  const continueRequest = useCallback(async () => {
    await Interceptor.continueRequest(id)
    setRequests([...Interceptor.requests])
  }, [id, setRequests])

  const failRequest = useCallback(async () => {
    await Interceptor.failRequest(id)
    setRequests([...Interceptor.requests])
  }, [id, setRequests])

  return {
    request: request as Readonly<Interceptor.Request>,
    continueRequest,
    failRequest,
    updateRequest: setRequest,
  }
}
