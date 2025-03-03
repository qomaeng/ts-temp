import nestConfig from '@alli/jest-config/nest.mjs';

/** @type {import('jest').Config} */
export default {
  ...nestConfig,
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
};
