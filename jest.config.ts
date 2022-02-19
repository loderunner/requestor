/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
/// <reference types="jest-extended" />

import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: [
    'jest-extended/all',
    '<rootDir>/src/__setups__/global-mocks.setup.ts',
    '<rootDir>/src/__setups__/chrome.setup.ts',
    '<rootDir>/src/__setups__/testing-library.setup.ts',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '\\.svg$': '<rootDir>/src/__mocks__/svgr.ts',
  },
}
