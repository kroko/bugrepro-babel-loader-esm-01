// postcss-load-config does not support ESM configuration yet

// this is one of few CJS type modules within BUGREPROSTRINGOMIT renderer source, so keep node off, just ignore here
/* eslint-disable no-undef */

module.exports = (ctx) => ({
  plugins: [
    require('autoprefixer')({
      // browsers: [], // defined in .browserslistrc file!
      cascade: true,
      add: true,
      remove: false,
      supports: true,
      flexbox: true,
      grid: false,
      ignoreUnknownVersions: false
    }),
    ctx.env === 'development'
      ? null
      : require('cssnano')({
        // https://cssnano.co/docs/optimisations
        preset: ['default', {
          autoprefixer: false, // do not remove prefixes
          discardComments: {
            removeAll: true
          },
          normalizeUrl: false,
          normalizeWhitespace: true,
          zindex: false
        }]
      })
  ].filter((e) => e !== null)
});
