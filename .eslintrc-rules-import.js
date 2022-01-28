module.exports = {
  'import/first': 'warn',
  'import/order': [
    'warn',
    {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
        'object',
        'type',
      ],
      'newlines-between': 'always',
      warnOnUnassignedImports: true,
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    },
  ],
  'import/newline-after-import': 'warn',
}
