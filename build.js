/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require('child_process')

const esbuild = require('esbuild')
const svgrPlugin = require('esbuild-plugin-svgr')

const watch = ['y', 'yes', 'true', '1'].includes(
  process.env.BUILD_WATCH?.toLowerCase()
)

const tailwindCSSPlugin = {
  name: 'tailwindcss',
  setup: (build) => {
    build.onEnd(() => {
      const { stdout, stderr } = child_process.spawnSync('tailwindcss', [
        '--input',
        './static/main.css',
        '--output',
        './out/main.css',
        '--color',
        process.env.NODE_ENV === 'production' ? '--minify' : '',
      ])

      process.stdout.write(stdout)
      process.stderr.write(stderr)
    })
  },
}

esbuild
  .build({
    entryPoints: ['src/background/index.ts', 'src/panel/index.tsx'],
    bundle: true,
    minify: process.env.NODE_ENV === 'production',
    sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
    plugins: [tailwindCSSPlugin, svgrPlugin({ icon: true })],
    outdir: 'out',

    logLevel: 'info',
    watch,
  })
  .catch(() => process.exit(1))
