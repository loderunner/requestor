import * as React from 'react'

export const RequestProvider = ({
  children,
}: {
  children: React.ReactNode
}) => <>{children}</>
export const useRequests = jest.fn(() => [globalMocks.request])
export const useRequest = jest.fn((id: string) => {
  if (id === 'request') {
    return globalMocks.request
  }
  throw new Error('Mock[useRequest]: request not found')
})
