// ESLint does not support ESM configuration yet

// keep json compatible key naming and allow comma trailing
/* eslint-disable quotes, quote-props, comma-dangle */

// this is one of few CJS type modules within BUGREPROSTRINGOMIT renderer source, so keep node off, just ignore here
/* eslint-disable no-undef */

const path = require('path');

module.exports = {
  "root": true,
  "extends": [
    path.resolve(__dirname, '../.eslintrc.js')
  ],
  "plugins": [
    "@babel/eslint-plugin",
    "eslint-plugin-react",
    "eslint-plugin-react-hooks"
  ],
  "parserOptions": {
    requireConfigFile: true,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "es2020": true,
    "node": false,
    "browser": true,
    "worker": false,
    "serviceworker": false
  },
  "rules": {
    // eslint-plugin-react recommended https://github.com/yannickcr/eslint-plugin-react#recommended
    "react/display-name": 2,
    "react/jsx-key": 2,
    "react/jsx-no-comment-textnodes": 2,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-target-blank": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-children-prop": 2,
    "react/no-danger-with-children": 2,
    "react/no-deprecated": 2,
    "react/no-direct-mutation-state": 2,
    "react/no-find-dom-node": 2,
    "react/no-is-mounted": 2,
    "react/no-render-return-value": 2,
    "react/no-string-refs": 2,
    "react/no-unescaped-entities": 2,
    "react/no-unknown-property": 2,
    "react/no-unsafe": 0,
    "react/prop-types": 2,
    "react/react-in-jsx-scope": 2,
    "react/require-render-return": 2,

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
