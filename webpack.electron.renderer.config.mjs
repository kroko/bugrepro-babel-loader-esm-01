// webpack config file

/* eslint-disable prefer-const, brace-style */

'use strict';

import path from 'path';
import fs from 'fs';
import url from 'url';

import {
  APP_URL_TYPES,
  warpConfigValidated
} from './.warp.webpack.config.renderer.mjs';

import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin'; // eslint-disable-line no-unused-vars
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin'; // eslint-disable-line no-unused-vars
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer'; // eslint-disable-line no-unused-vars
import crypto from 'crypto';
// OMIT WEBPACKDEVSERVER IN BUGREPRO
// import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'; // eslint-disable-line no-unused-vars

// ----------------

const cjsDirname = path.dirname(url.fileURLToPath(import.meta.url));
const WARP_RENDERER_INDEX_FILENAME = 'index.html';

// ----------------
// Env and tier
const tierIsProduction = process.env.NODE_ENV === 'production';
const tierIsStaging = process.env.NODE_ENV === 'staging';
const tierIsTesting = process.env.NODE_ENV === 'testing';
const tierIsDevelopment = process.env.NODE_ENV === 'development' || !(tierIsProduction || tierIsStaging || tierIsTesting);

let tierName;
if (tierIsProduction) {
  tierName = 'production';
} else if (tierIsStaging) {
  tierName = 'staging';
} else if (tierIsTesting) {
  tierName = 'testing';
} else {
  tierName = 'development';
}

// ----------------
// Env, webpack DevServer OOB adds this ENV variable
// OMIT WEBPACKDEVSERVER IN BUGREPRO
const WDS_RUNNING = !!process.env.WEBPACK_DEV_SERVER;

// ----------------
// Env, User defined flag to set static file serving for webpack DevServer
// OMIT WEBPACKDEVSERVER IN BUGREPRO
const WDS_SERVE_STATIC = !!process.env.WDS_SERVE_STATIC && process.env.WDS_SERVE_STATIC === 'true';

// ----------------
// Implemented URL types
// const APP_URL_TYPES = appProps.APP_URL_TYPES;

const appProps = warpConfigValidated();

// ----------------
// Current tier props
let currBuildTierProps;
if (WDS_RUNNING) {
  currBuildTierProps = appProps.buildTiers.wdsTier;
} else {
  currBuildTierProps = appProps.buildTiers[tierName];
}

// ----------------
// Output filesystem path
// file system path, used to set application base path for later use
const appPathFsRoot = currBuildTierProps.appPathFsRoot;
const appPathFsBuild = currBuildTierProps.appPathFsBuild;
const appPathFsIndex = currBuildTierProps.appPathFsIndex;

// ----------------
// Host, port, output public path based on env and props

// Declarations

let appFqdnName; // From props. FQDN, i.e., 'hostname.domain.tld'
let appFqdnPortNumber; // From props. At which port app is running. Usually empty (default 80|443) or 4xxx for devserver
let appFqdnTls; // From props. true | false
let appFqdnProtocolRelative; // From props. true | false, protocol-relative is anti-pattern, but still handy

let appPathUrlType; // From props. see options below
let appPathUrlPathIndexAboveServerRoot; // From props. i.e., 'some/path/above/webroot/'
let appPathUrlPathBuildRelativeToAppIndex; // URL path for appPathFsBuild, relative to app index (index.html) path

let appPathUrlFinalIndexPublicPath; // Constructed. Will be constructed along the way and used in config
let appPathUrlFinalBuildPublicPath; // Constructed. Will be constructed along the way and used in webpack.config.output.publicPath a.o.

// Definitions

// Get props for build tier
appFqdnName = currBuildTierProps.fqdnName;
appFqdnPortNumber = currBuildTierProps.fqdnPort;
appFqdnTls = currBuildTierProps.fqdnTls;
appFqdnProtocolRelative = currBuildTierProps.fqdnProtocolRelative;
appPathUrlType = currBuildTierProps.appPathUrlType;
appPathUrlPathIndexAboveServerRoot = currBuildTierProps.appPathUrlPathIndexAboveServerRoot;
appPathUrlPathBuildRelativeToAppIndex = currBuildTierProps.appPathUrlPathBuildRelativeToAppIndex;

if (appPathUrlType === APP_URL_TYPES.ABSOLUTE_FQDN) {
  const appPortString = (appFqdnPortNumber) ? `:${appFqdnPortNumber}` : ''; // Constructed. i.e., ':4000'
  const appProtocolPrefix = appFqdnProtocolRelative ? '' : appFqdnTls ? 'https:' : 'http:'; // Constructed. i.e., 'https:', 'http:', ''.
  appPathUrlFinalIndexPublicPath = `${appProtocolPrefix}//${appFqdnName}${appPortString}${appPathUrlPathIndexAboveServerRoot}`;
  appPathUrlFinalBuildPublicPath = `${appPathUrlFinalIndexPublicPath}${appPathUrlPathBuildRelativeToAppIndex}`;
} else if (appPathUrlType === APP_URL_TYPES.RELATIVE_SERVER_ROOT) {
  appPathUrlFinalIndexPublicPath = `${appPathUrlPathIndexAboveServerRoot}`;
  appPathUrlFinalBuildPublicPath = `${appPathUrlPathIndexAboveServerRoot}${appPathUrlPathBuildRelativeToAppIndex}`;
}
else if (appPathUrlType === APP_URL_TYPES.RELATIVE_APP_INDEX) {
  appPathUrlFinalIndexPublicPath = `${appPathUrlPathIndexAboveServerRoot}`;
  appPathUrlFinalBuildPublicPath = `${appPathUrlPathBuildRelativeToAppIndex}`;
}

// ----------------
// MiniCssExtractPlugin
const miniCssExtractEnabled = !tierIsDevelopment;
// if tier is development, then CSS gets inlined in JavaScript (style-loader is called, not MiniCssExtractPlugin is not called)
// if tier is not development, then URLs in CSS depend on appPathUrlType
const miniCssExtractPublicPath = (tierIsDevelopment) ? appPathUrlFinalBuildPublicPath : (appPathUrlType === APP_URL_TYPES.RELATIVE_APP_INDEX) ? './' : appPathUrlFinalBuildPublicPath;

// ----------------
// Source map type
const sourceMapType = (tierIsDevelopment) ? 'inline-source-map' : false;

// ----------------
// Setup log
console.log('\x1b[42m%s\x1b[0m', ' '.repeat(process.stdout.columns));
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'DEV SERVER RUNNING', WDS_RUNNING);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'DEV SERVER STATIC', WDS_SERVE_STATIC);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'Building for tier', tierName);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathFsRoot', appPathFsRoot);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathFsBuild', appPathFsBuild);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathFsIndex', appPathFsIndex);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathUrlType', appPathUrlType);
if (appPathUrlType === APP_URL_TYPES.ABSOLUTE_FQDN) {
  console.log('\x1b[45m\x1b[33m%s\x1b[0m', 'Absolute FQDN URL type used.');
} else {
  console.log('\x1b[45m\x1b[33m%s\x1b[0m', 'Relative URL type used, thus hostname, port, tls does not apply.');
}
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathUrlPathBuildRelativeToAppIndex', appPathUrlPathBuildRelativeToAppIndex);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathUrlFinalIndexPublicPath', appPathUrlFinalIndexPublicPath);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'appPathUrlFinalBuildPublicPath', appPathUrlFinalBuildPublicPath);
console.log('\x1b[44m\x1b[33m%s\x1b[0m -> \x1b[36m%s\x1b[0m', 'miniCssExtractPublicPath', miniCssExtractPublicPath);
console.log('\x1b[42m%s\x1b[0m', ' '.repeat(process.stdout.columns));

// ----------------
// BASE CONFIG
// https://webpack.js.org/configuration/#options
const config = {
  mode: tierIsDevelopment ? 'development' : 'production',
  devtool: sourceMapType,
  context: cjsDirname,
  target: 'web', // no 'electron-renderer' as we have nodeIntegration disabled, keep web
  // https://webpack.js.org/configuration/other-options/#infrastructurelogging
  infrastructureLogging: {
    level: 'info'
  },
  // https://webpack.js.org/configuration/stats/
  stats: 'normal',
  // https://webpack.js.org/configuration/entry-context/#entry
  entry: {
    index: [
      // 'whatwg-fetch',
      // 'eligrey-classlist-js-polyfill',
      path.resolve(cjsDirname, 'app-renderer/src/index.mjs')
    ]
  },
  // https://webpack.js.org/configuration/output/
  output: {
    path: appPathFsBuild,
    publicPath: appPathUrlFinalBuildPublicPath,
    filename: (tierIsDevelopment) ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: (tierIsDevelopment) ? '[id].js' : '[id].[contenthash].js'
  },
  // https://webpack.js.org/configuration/resolve/
  resolve: {
    modules: [
      path.resolve(cjsDirname, 'app-renderer/src/'),
      'node_modules'
    ],
    extensions: ['.js', '.mjs', '.json', '.jsx', '.css'],
    alias: {
      //
    }
  }
};

// ----------------
// WEBPACK DEVSERVER CONFIG
config.devServer = {
  host: appFqdnName,
  port: appFqdnPortNumber,

  client: {
    host: appFqdnName,
    port: appFqdnPortNumber,
    overlay: {
      warnings: false,
      errors: true
    }
  },

  static: (!WDS_SERVE_STATIC)
    ? false
    : [
        {
          directory: appPathFsRoot,
          staticOptions: {},
          publicPath: [
            appPathUrlPathIndexAboveServerRoot
          ],
          // https://github.com/expressjs/serve-index
          serveIndex: true,
          // https://github.com/paulmillr/chokidar
          watch: false
        }
      ],

  // https://github.com/webpack/webpack-dev-middleware#options
  dev: {
    // methods: ['GET', 'HEAD'],
    // headers: {},
    index: WARP_RENDERER_INDEX_FILENAME,
    // mimeTypes: undefined,
    publicPath: appPathUrlFinalBuildPublicPath,
    // serverSideRender: undefined,
    writeToDisk (filePath) {
      return filePath.match(/preflight\.(js|css)$/);
    }
    // outputFileSystem: memfs
  },

  headers: {
    'Access-Control-Allow-Origin': '*',
    'X-Content-Type-Options': 'nosniff'
  },

  firewall: false,

  hot: true,
  transportMode: 'ws',

  bonjour: false,
  compress: true,
  historyApiFallback: true,
  useLocalIp: false,
  onBeforeSetupMiddleware (app, server, compiler) {
    console.log('webpack DevServer middleware before');
  },
  onAfterSetupMiddleware (app, server, compiler) {
    console.log('webpack DevServer middleware after');
  },
  onListening (server) {
    const port = server.server.address().port;
    console.log('webpack DevServer listening on port:', port);
  },

  https: tierIsDevelopment && appFqdnTls
    ? {
        ca: fs.readFileSync(path.join(cjsDirname, 'letsencrypt/dev.warp.lv/fullchain2.pem')),
        key: fs.readFileSync(path.join(cjsDirname, 'letsencrypt/dev.warp.lv/privkey2.pem')),
        cert: fs.readFileSync(path.join(cjsDirname, 'letsencrypt/dev.warp.lv/cert2.pem'))
      }
    : false,

  open: false,
  openPage: '/different/page'
};

// ----------------
// MODULE RULES
config.module = {
  rules: [
    // --------
    // JavaScript
    {
      test: /\.(js|mjs|ts)x?$/,
      exclude: [/node_modules/, /bower_components/, /preflight\.js$/],
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true, // normaly should be true, set false for babel debug purposes
            cacheCompression: false
          }
        }
      ]
    },
    // --------
    // CSS
    {
      test: /\.(css)$/,
      use: [
        miniCssExtractEnabled
          ? {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: miniCssExtractPublicPath
              }
            }
          : {
              loader: 'style-loader',
              options: {}
            },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
            modules: {
              auto: false
            }
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            options: {
              postcssOptions: {
                config: path.resolve(cjsDirname, 'app-renderer/.postcssrc.js')
              }
            }
          }
        },
        {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    },
    // --------
    // SCSS
    {
      test: /\.(scss)$/,
      use: [
        tierIsDevelopment
          ? {
              loader: 'style-loader',
              options: {}
            }
          : {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: miniCssExtractPublicPath
              }
            },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 3,
            sourceMap: true,
            modules: {
              auto: true, // /\.module\.\w+$/i.test(filename)
              compileType: 'module',
              mode: (resourcePath) => {
                if (/pure.scss$/i.test(resourcePath)) { return 'pure'; }
                if (/global.scss$/i.test(resourcePath)) { return 'global'; }
                return 'local';
              },
              exportGlobals: false,
              localIdentName: (tierIsDevelopment) ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:22]',
              // localIdentContext
              // localIdentHashPrefix
              namedExport: false,
              exportLocalsConvention: 'asIs',
              exportOnlyLocals: false
            }
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            additionalData: `$env: ${tierName};`
          }
        }
      ]
    },
    // --------
    // FONT FILE LOADING
    {
      test: /(\.(woff2|woff|otf|ttf|eot)|(\.|-)webfont\.svg)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {}
        }
      ]
    },
    // --------
    // IMAGE FILE LOADING
    {
      test: /\.(gif|png|jpe?g|svg)$/i,
      exclude: /(\.|-)webfont\.svg$/i,
      use: [
        {
          loader: 'file-loader',
          options: {}
        },
        {
          loader: 'image-webpack-loader',
          options: {
            disable: tierIsDevelopment
          }
        }
      ]
    }
  ]
};

// ----------------
// OPTIMISATION
config.optimization = {
  minimize: !(tierIsDevelopment || tierIsTesting), // can override
  // minimize: false,
  minimizer: [
    new TerserPlugin({
      test: /\.m?js(\?.*)?$/i,
      // include: '',
      // exclude: '',
      parallel: true,
      // minify: (file, sourceMap) => {},
      extractComments: false,
      // https://github.com/terser/terser#minify-options
      terserOptions: {
        // ecma: undefined,
        // https://github.com/terser/terser#parse-options
        parse: {},
        // https://github.com/terser/terser#compress-options
        compress: {
          drop_console: !(tierIsDevelopment || tierIsTesting)
          // drop_console: !(tierIsDevelopment)
        },
        // https://github.com/terser/terser#mangle-options
        mangle: false,
        module: false,
        // https://github.com/terser/terser#format-options
        format: {
          comments: false
        },
        sourceMap: false,
        toplevel: false,
        nameCache: null,
        ie8: false,
        // keep_classnames: undefined,
        keep_fnames: false,
        safari10: false
      }
    })
  ]

  // Omit chunking in bug repro

};

// ----------------
// PLUGINS
config.plugins = [];

// ----------------
// DefinePlugin
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': (tierIsDevelopment) ? JSON.stringify('development') : JSON.stringify('production'),
  'process.env.BROWSER': true,
  __TIER_DEVELOPMENT__: tierIsDevelopment,
  __TIER_TESTING__: tierIsTesting,
  __TIER_STAGING__: tierIsStaging,
  __TIER_PRODUCTION__: tierIsProduction,
  __TIER_DEV_OR_TEST__: tierIsDevelopment || tierIsTesting,
  __CLIENT__: true,
  __SERVER__: false,
  __DEVTOOLS__: tierIsDevelopment,
  __DEV__: tierIsDevelopment,
  __PROD__: !tierIsDevelopment,
  // __DEBUG_ALLOWED__: tierIsDevelopment || tierIsTesting // for debug to work
  // 'process.env.DEBUG': (tierIsDevelopment) ? JSON.stringify(true) : JSON.stringify(false),
  __WARP_DEBUG__: tierIsDevelopment || tierIsTesting // for debug to work
}));

// ----------------
// ESLintPlugin
config.plugins.push(new ESLintPlugin({
  extensions: ['js', 'mjs', 'ts', 'jsx', 'mjsx', 'tsx'],
  // files: /\.(js|mjs|ts)x?$/,
  exclude: ['node_modules'],
  // https://github.com/webpack-contrib/eslint-webpack-plugin#errors-and-warning
  emitError: true,
  emitWarning: true,
  failOnError: !tierIsDevelopment,
  failOnWarning: false,
  quiet: false,
  outputReport: false
}));

// ----------------
// StyleLint
config.plugins.push(new StylelintPlugin({
  // https://github.com/webpack-contrib/stylelint-webpack-plugin#options
  configFile: path.resolve(cjsDirname, 'app-renderer/.stylelintrc.js'),
  files: ['**/*.(s(c|a)ss|css)'],
  fix: false,
  lintDirtyModulesOnly: false,
  // https://github.com/webpack-contrib/stylelint-webpack-plugin#errors-and-warning
  emitError: true,
  emitWarning: true,
  failOnError: false,
  failOnWarning: false,
  quiet: false
}));

// ----------------
// Hot reloading
if (tierIsDevelopment && WDS_RUNNING) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

// ----------------
// HtmlWebpackPlugin
config.plugins.push(new HtmlWebpackPlugin({
  // --------
  // Custom template variables
  warp: {
    WDS_RUNNING,
    appPathUrlFinalBuildPublicPath,
    // preflightInline: {
    //   'preflight.js': fs.readFileSync(path.resolve(cjsDirname, 'app-renderer/src/preflight/preflight.js'), 'utf8'),
    //   'preflight.css': fs.readFileSync(path.resolve(cjsDirname, 'app-renderer/src/preflight/preflight.css'), 'utf8')
    // },
    // inline only when !tierIsDevelopment (see chunkFilename naming scheme)
    runtimeInlineRegex: /runtime\.[a-z0-9]+\.js$/,
    CSP_WEBPACKBUILD_WARP_NONCE: crypto.randomBytes(16).toString('base64')
    // <%= CSP_WEBPACKBUILD_WARP_NONCE %>
    // <!--# echo var='CSP_NGINX_WARP_NONCE' default='' -->
  },
  // --------
  // html-webpack-plugin options
  // https://github.com/jantimon/html-webpack-plugin#options
  title: 'EXAMPLE - BLABLA',
  filename: path.join(appPathFsIndex, WARP_RENDERER_INDEX_FILENAME),
  template: path.resolve(cjsDirname, 'app-renderer/src/html/index.html.template.ejs'),
  // templateContent: false,
  // templateParameters: false,
  inject: false, // currently specify manually entry outputs in template
  // publicPath: 'auto',
  // scriptLoading: 'blocking',
  // favicon: favicon.ico,
  // meta: {},
  // base: false,
  hash: false, // done at global level
  cache: true,
  showErrors: true,
  // chunks: [],
  chunksSortMode: 'auto',
  // excludeChunks: [],
  xhtml: true,
  // minify: false,
  minify: (tierIsDevelopment)
    ? false
    : {
        minifyJS: true,
        minifyCSS: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
        useShortDoctype: true
      }, // https://github.com/terser/html-minifier-terser#options-quick-reference
  // --------
  // HtmlWebpackHarddiskPlugin
  alwaysWriteToDisk: true

}));
// HtmlWebpackPlugin - HtmlWebpackHarddiskPlugin
config.plugins.push(new HtmlWebpackHarddiskPlugin());

// // ----------------
// // CopyPlugin
// config.plugins.push(new CopyPlugin({
//   patterns: [
//     // Disable copy, inline preflight in HTML
//     // {
//     //   from: path.join(cjsDirname, 'app-renderer/src/preflight/*.{js,css}'),
//     //   to: appPathFsBuild,
//     //   flatten: true,
//     //   toType: 'dir'
//     // }
//     // {
//     //   from: path.join(cjsDirname, 'app-renderer/src/pwa/service-worker-worker-manual.js'),
//     //   to: path.join(appPathFsRoot, 'sw.js'),
//     //   transform: (content, path) => {
//     //     return content; // return Promise.resolve(optimize(content));
//     //   },
//     //   cacheTransform: false,
//     //   flatten: true,
//     //   toType: 'file',
//     //   force: true // overwrite
//     // },
//   ],
//   options: {
//     concurrency: 100
//   }
// }));

// ----------------
// MiniCssExtractPlugin
if (miniCssExtractEnabled) {
  config.plugins.push(new MiniCssExtractPlugin({
    filename: (tierIsDevelopment) ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: (tierIsDevelopment) ? '[id].css' : '[id].[contenthash].css'
  }));
}

// ----------------
// BundleAnalyzerPlugin
if (appProps.webpackBundleAnalyzer.enable) {
  if (tierIsDevelopment) {
    console.log('\x1b[41m%s\x1b[0m', 'BundleAnalyzerPlugin should not be run when building for development and/or DevServer. Will not enable analysis!');
  }
  else {
    config.plugins.push(new BundleAnalyzerPlugin({
      ...{},
      ...appProps.webpackBundleAnalyzer.options
    }));
  }
}

// ----------------
// POSTCSS LOADER CONFIG
// defined in .postcssrc.js

// ----------------
// BROWSERSLIST CONFIG
// defined in .browserslistrc

// ----------------
// BABEL CONFIG
// defined in .babelrc.js

// ----------------
// ESLINT CONFIG
// defined in .eslintrc.js and .eslintignore

// ----------------
// STYLELINT CONFIG
// defined in .stylelintrc.js and .stylelintignore

export default config;
