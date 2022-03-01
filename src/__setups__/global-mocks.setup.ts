import type { Intercept, Request } from '@/interceptor'

interface GlobalMocks {
  request: Request
  response: Request
  intercept: Intercept
  target: chrome.debugger.TargetInfo
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

const payloadJSON = JSON.stringify(payload)

const globalMocks: GlobalMocks = {
  request: {
    id: 'request',
    interceptResponse: false,
    stage: 'Request',
    headers: {
      Accept: '*/*',
      Cookie: 'CONSENT=YES; DATE=2022-02-20-16',
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
    postData: payloadJSON,
  },
  response: {
    id: 'response',
    interceptResponse: true,
    stage: 'Response',
    headers: {
      date: 'Sun, 27 Feb 2022 19:44:34 GMT',
      'content-type': 'application/json; charset=utf-8',
      'content-length': `${payloadJSON.length}`,
      server: 'gunicorn/19.9.0',
    },
    initialPriority: 'High',
    method: 'OPTIONS',
    referrerPolicy: 'unsafe-url',
    url: 'https://www.example.com/complete/search?q=toto&client=gws-wiz',
    statusCode: 200,
    statusText: 'OK',
  },
  intercept: {
    id: 'inter',
    pattern: 'example.com',
    enabled: true,
    regexp: false,
    interceptResponse: false,
  },
  target: {
    attached: false,
    id: 'target',
    title: 'Title',
    type: 'page',
    url: 'https://example.com',
  },
}

Object.assign(global, { globalMocks })
