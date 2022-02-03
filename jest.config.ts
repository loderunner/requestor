/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/// <reference types="jest-extended" />
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    './node_modules/jest-enzyme/lib/index.js',
    'jest-extended/all',
    './__setups__/chrome.setup.ts',
    './__setups__/enzyme.setup.ts',
  ],
}
