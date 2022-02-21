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
      Accept: '*/*',
      Cookie:
        'CONSENT=YES+srp.gws-20220217-0-RC1.en+FX+923; 1P_JAR=2022-02-20-16',
      Referer: 'https://www.google.com/',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      'Content-Type': 'application/json',
    },
    initialPriority: 'High',
    method: 'POST',
    referrerPolicy: 'origin',
    url: 'https://www.example.com/complete/search?q=toto&client=gws-wiz',
    hasPostData: true,
    postData: JSON.stringify(payload),
  },
  intercept: {
    id: 'inter',
    pattern: 'example.com',
    enabled: true,
    regexp: false,
  },
}

Object.assign(global, { globalMocks })
