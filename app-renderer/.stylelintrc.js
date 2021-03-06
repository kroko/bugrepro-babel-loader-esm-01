// ESM support not checked

// keep json compatible key naming and comma trailing
/* eslint-disable quotes, quote-props */

// this is one of few CJS type modules within BUGREPROSTRINGOMIT renderer source, so keep node off, just ignore here
/* eslint-disable no-undef */

module.exports = {
  "extends": [
    "stylelint-config-standard"
  ],
  "plugins": [
    "stylelint-scss"
  ],
  "rules": {

    "no-empty-source": null, // https://stylelint.io/user-guide/rules/no-empty-source

    "rule-empty-line-before": "always", // https://stylelint.io/user-guide/rules/rule-empty-line-before

    "block-closing-brace-empty-line-before": null, // https://stylelint.io/user-guide/rules/block-closing-brace-empty-line-before
    "max-empty-lines": [ // https://stylelint.io/user-guide/rules/max-empty-lines
      2,
      {
        "ignore": [
          "comments"
        ]
      }
    ],

    // disable at-rule-no-unknown
    // specify in scss/at-rule-no-unknown
    "at-rule-no-unknown": null, // https://stylelint.io/user-guide/rules/at-rule-no-unknown

    // --------------------------------------------
    // RULES FOR SCSS MODULES

    "selector-pseudo-class-no-unknown": [
      true,
      {
        ignorePseudoClasses: [
          "export",
          "import",
          "global",
          "local",
          "external"
        ]
      }
    ],
    "selector-type-no-unknown": [
      true,
      {
        ignoreTypes: ["from"]
      }
    ],
    "property-no-unknown": [
      true,
      {
        ignoreProperties: ["composes", "compose-with"],
        ignoreSelectors: [":export", /^:import/]
      }
    ],
    "value-keyword-case": [
      "lower",
      {
        ignoreProperties: ["composes", "compose-with"]
      }
    ],

    // disable at-rule-no-unknown
    // specify in scss/at-rule-no-unknown
    // "at-rule-no-unknown": [
    //   true,
    //   {
    //     ignoreAtRules: ["value"]
    //   }
    // ],

    // --------------------------------------------
    // RULES FOR SCSS TO WORK (BASE)

    "block-opening-brace-space-before": "always", // https://stylelint.io/user-guide/rules/block-opening-brace-space-before
    "block-closing-brace-newline-after": [ // https://stylelint.io/user-guide/rules/block-closing-brace-newline-after
      "always",
      {
        "ignoreAtRules": [
          "if",
          "else"
        ]
      }
    ],

    "at-rule-empty-line-before": [ // https://stylelint.io/user-guide/rules/at-rule-empty-line-before
      "always",
      {
        "ignoreAtRules": [
          "else",
          "import"
        ]
      }
    ],
    "at-rule-name-space-after": "always", // https://stylelint.io/user-guide/rules/at-rule-name-space-after

    // --------------------------------------------
    // RULES FOR SCSS TO WORK (SCSS PLUGIN)

    "scss/at-rule-no-unknown": [ // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-rule-no-unknown/README.md
      true,
      {
        ignoreAtRules: ["value"] // for CSS Modules
      }
    ],

    "scss/at-else-closing-brace-newline-after": "always-last-in-chain", // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-else-closing-brace-newline-after/README.md
    "scss/at-else-closing-brace-space-after": "always-intermediate", // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-else-closing-brace-space-after/README.md
    "scss/at-else-empty-line-before": "never", // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-else-empty-line-before/README.md

    "scss/at-if-closing-brace-newline-after": "always-last-in-chain", // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-if-closing-brace-newline-after/README.md
    "scss/at-if-closing-brace-space-after": "always-intermediate" // https://github.com/kristerkari/stylelint-scss/blob/master/src/rules/at-if-closing-brace-space-after/README.md
  }
};
