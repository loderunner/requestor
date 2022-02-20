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
    headers: {
      Accept: '*/*',
      Cookie:
        'CONSENT=YES+srp.gws-20220217-0-RC1.en+FX+923; 1P_JAR=2022-02-20-16',
      Referer: 'https://www.google.com/',
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
      'sec-ch-ua':
        '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
      'sec-ch-ua-arch': '"x86"',
      'sec-ch-ua-bitness': '"64"',
      'sec-ch-ua-full-version': '"98.0.4758.102"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-model': '',
      'sec-ch-ua-platform': '"macOS"',
      'sec-ch-ua-platform-version': '"12.1.0"',
    },
    initialPriority: 'High',
    method: 'GET',
    referrerPolicy: 'origin',
    url: 'https://www.example.com/complete/search?q=toto&client=gws-wiz',
  },
  intercept: { id: 'inter', pattern: 'example.com', enabled: true },
}

Object.assign(global, { globalMocks })
