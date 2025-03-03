import baseConfig from './base.mjs';

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  rootDir: 'src',
  testRegex: '.*\\.(spec|test)\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
