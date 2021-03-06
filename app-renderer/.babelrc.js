// Babel supports ESM configurationm, but babel-loader still chokes

// keep json compatible key naming and comma trailing
/* eslint-disable quotes, quote-props */

// this is one of few CJS type modules within BUGREPROSTRINGOMIT renderer source, so keep node off, just ignore here
/* eslint-disable no-undef */

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
    ],
    [
      "@babel/preset-react",
      {
        development: process.env.BABEL_ENV === "development"
      }
    ]
  ],
  "plugins": process.env.BABEL_ENV === "development"
    ? [
        // OMIT WEBPACKDEVSERVER IN BUGREPRO
        // "react-refresh/babel",
        "@babel/plugin-syntax-jsx"
      ]
    : [
        "@babel/plugin-syntax-jsx"
      ]
};
