// cypress/plugins/index.js
module.exports = (on, config) => {
  // save all test results as a JSON file
  // https://github.com/bahmutov/cypress-json-results
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('cypress-json-results')({
    on,
    filename: 'cypress/output/result.json', // default filename
  });
};
