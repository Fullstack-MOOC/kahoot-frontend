// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

const env = dotenv.config('./.env').parsed;

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5200/',
    setupNodeEvents(on, config) {
      // eslint-disable-next-line global-require, import/extensions
      return require('./cypress/plugins/index.js')(on, config);
    },
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
