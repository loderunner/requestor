/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/// <reference types="jest-extended" />
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['jest-extended/all', './__setups__/chrome.setup.ts'],
}
