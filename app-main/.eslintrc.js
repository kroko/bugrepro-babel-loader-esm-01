// ESLint does not support ESM configuration yet

// keep json compatible key naming and allow comma trailing
/* eslint-disable quotes, quote-props, comma-dangle */

const path = require('path');

module.exports = {
  "root": true,
  "extends": [
    path.resolve(__dirname, '../.eslintrc.js')
  ],
  "parserOptions": {
    requireConfigFile: true
  },
  "env": {
    "es2020": true,
    "node": true,
    "browser": false,
    "worker": false,
    "serviceworker": false
  }
};
