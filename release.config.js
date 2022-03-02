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
          'chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
        assets: ['package.json', 'package-lock.json', 'CHANGELOG.md'],
      },
    ],
    '@semantic-release/github',
  ],
}
