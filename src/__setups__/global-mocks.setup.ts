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
    arr: [
      0.7309955249202127, 0.45152102178420384, 0.3101491368469109,
      0.33964078594296154, 0.579201406715314,
    ],
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
