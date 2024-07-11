// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

const env = dotenv.config('./.env').parsed;

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/',
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  env: {
    ...env,
  },
});
