// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuild = require('esbuild')

const watch = ['y', 'yes', 'true', '1'].includes(
  process.env.BUILD_WATCH?.toLowerCase()
)

esbuild
  .build({
    entryPoints: ['src/background/index.ts', 'src/panel/index.tsx'],
    loader: {
      '.woff': 'file',
      '.woff2': 'file',
    },
    bundle: true,
    minify: process.env.NODE_ENV !== 'production',
    sourcemap: process.env.NODE_ENV !== 'production' ? 'inline' : false,
    outdir: 'out',

    logLevel: 'info',
    watch,
  })
  .catch(() => process.exit(1))
