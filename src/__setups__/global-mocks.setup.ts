import type { Intercept, Request } from '@/interceptor'

interface GlobalMocks {
  request: Request
  intercept: Intercept
}

declare global {
  const globalMocks: GlobalMocks
}

const payload = {
  hello: 'world',
  obj: {
    barbes: 'rochechouart',
    version: 1,
    toto: null,
    arr: new Array<number>(5).fill(0).map(() => Math.random()),
    nested: {
      thx: 1138,
      star: 'wars',
    },
  },
  done: true,
}

const globalMocks: GlobalMocks = {
  request: {
    id: 'request',
    headers: {
      'Content-Type': 'application/json',
    },
    initialPriority: 'High',
    method: 'POST',
    referrerPolicy: 'origin',
    url: 'https://www.example.com/complete/search?q=toto&client=gws-wiz',
    hasPostData: true,
    postData: JSON.stringify(payload),
  },
  intercept: { id: 'inter', pattern: 'example.com', enabled: true },
}

Object.assign(global, { globalMocks })
