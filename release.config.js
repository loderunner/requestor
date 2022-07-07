module.exports = {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    '@semantic-release/changelog',
    [
      '@semantic-release/git',
      {
        message:
          'chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}\n\n',
        assets: [
          'package.json',
          'package-lock.json',
          'CHANGELOG.md',
          'manifest.json',
        ],
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: [{ path: 'requestor-${nextRelease.version}.zip' }],
      },
    ],
    [
      'semantic-release-chrome',
      {
        asset: 'requestor-${nextRelease.version}.zip',
        extensionId: 'bldeigcbieaclhoogjejelbipeklpckg',
      },
    ],
  ],
}
