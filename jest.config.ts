/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    './node_modules/jest-enzyme/lib/index.js',
    './__setups__/chrome.setup.ts',
    './__setups__/enzyme.setup.ts',
  ],
}
