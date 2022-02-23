import * as React from 'react'

export const RequestProvider = ({
  children,
}: {
  children: React.ReactNode
}) => <>{children}</>

export const useRequests = jest.fn(() => ({
  requests: [globalMocks.request],
  continueAllRequests: jest.fn(),
}))

const continueRequest = jest.fn(() => {})
const failRequest = jest.fn(() => {})
export const useRequest = jest.fn((id: string) => {
  if (id === 'request') {
    return { request: globalMocks.request, continueRequest, failRequest }
  }
  throw new Error('Mock[useRequest]: request not found')
})
