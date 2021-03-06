// GROUND ESLINT RULES FOR BUGREPROSTRINGOMIT
// APP MAIN SIDE HAS IT'S OWN OVERRIDES
// APP RENDERER AND PRELOAD SIDE HAS IT'S OWN OVERRIDES

// ESLint does not support ESM configuration yet
// keep json compatible key naming and allow comma trailing
/* eslint-disable quotes, quote-props, comma-dangle */

module.exports = {
  "root": true,

  "extends": [
    "eslint-config-standard"
  ],
  "plugins": [
    // "eslint-plugin-standard", // included by eslint-config-standard
    // "eslint-plugin-promise", // included by eslint-config-standard
    // "eslint-plugin-import", // included by eslint-config-standard
    // "eslint-plugin-node", // included by eslint-config-standard
    "@babel/eslint-plugin"
  ],

  "parser": "@babel/eslint-parser",

  // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
  "parserOptions": {
    requireConfigFile: false, // NOTE: this base will avoid babel config
    // "ecmaVersion": 2015, // same as 6
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "globalReturn": true,
      "impliedStrict": true,
      "jsx": false
    }
  },

  "env": {
    "es2020": true,
    "node": true,
    "browser": false,
    "worker": false,
    "serviceworker": false
  },

  "rules": {
    // "off" or 0 - turn the rule off
    // "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
    // "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)

    // Semicolons
    "semi": [2, "always"], // https://eslint.org/docs/rules/semi
    "no-extra-semi": 2, // https://eslint.org/docs/rules/no-extra-semi
    "semi-spacing": [2, {"before": false, "after": true}], // https://eslint.org/docs/rules/semi-spacing

    // Spacing
    // curly spacing, keep "consistent" with array-bracket-spacing
    "object-curly-spacing": [1, "never"], // https://eslint.org/docs/rules/object-curly-spacing
    "generator-star-spacing": [1, {"before": true, "after": false}], // https://eslint.org/docs/rules/generator-star-spacing

    // Others
    "brace-style": [1, "stroustrup"], // https://eslint.org/docs/rules/brace-style
    "object-shorthand": [1, "always"], // https://eslint.org/docs/rules/object-shorthand
    "arrow-parens": [1, "always"], // https://eslint.org/docs/rules/arrow-parens
    "no-unused-expressions": 0, // https://eslint.org/docs/rules/no-unused-expressions hande this in Babel level because of do expressions

    // JSX
    "jsx-quotes": [2, "prefer-double"], // https://eslint.org/docs/rules/jsx-quotes

    // eslint-plugin-import, https://github.com/benmosher/eslint-plugin-import
    // Ensure consistent use of file extension within the import path
    "import/extensions": [0, {"js": "always", "json": "always"}], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md

    // babel-eslint-plugin, https://github.com/babel/babel/tree/main/eslint/babel-eslint-plugin#rules
    "@babel/new-cap": 1,
    "@babel/object-curly-spacing": 1,
    "@babel/no-unused-expressions": 2,
  }
};
