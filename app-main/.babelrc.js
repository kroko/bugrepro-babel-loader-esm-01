// Babel supports ESM configurationm, but babel-loader still chokes

// keep json compatible key naming and comma trailing
/* eslint-disable quotes, quote-props */

// export default {
module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        // https://babeljs.io/docs/en/babel-preset-env.html#modules
        "modules": false,
        // https://babeljs.io/docs/en/babel-preset-env.html#usebuiltins
        "useBuiltIns": "usage",
        // https://babeljs.io/docs/en/babel-preset-env.html#corejs
        // https://github.com/zloirock/core-js#babelpreset-env
        "corejs": '3.8',
        // https://babeljs.io/docs/en/babel-preset-env.html#forcealltransforms
        "forceAllTransforms": false,
        // https://babeljs.io/docs/en/babel-preset-env.html#ignorebrowserslistconfig
        "ignoreBrowserslistConfig": false,
        // https://babeljs.io/docs/en/babel-preset-env.html#debug
        "debug": true
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-private-methods"
    // "@babel/plugin-proposal-do-expressions"
  ]
};
