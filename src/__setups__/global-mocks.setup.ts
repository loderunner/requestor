import type { Intercept, Request } from '@/interceptor'

interface GlobalMocks {
  request: Request
  intercept: Intercept
}

declare global {
  const globalMocks: GlobalMocks
}

const globalMocks: GlobalMocks = {
  request: {
    id: 'request',
    headers: {},
    initialPriority: 'Medium',
    method: 'GET',
    referrerPolicy: 'same-origin',
    url: 'https://example.com',
  },
  intercept: { id: 'inter', pattern: 'example.com', enabled: true },
}

Object.assign(global, { globalMocks })
