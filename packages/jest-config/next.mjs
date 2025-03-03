import nextJest from 'next/jest';

import baseConfig from './base.mjs';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = {
  ...baseConfig,
  moduleFileExtensions: [...baseConfig.moduleFileExtensions, 'jsx', 'tsx'],
  testEnvironment: 'jsdom',
};

export default createJestConfig(config);
