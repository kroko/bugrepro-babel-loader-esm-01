// keep json compatible key naming and comma trailing

/* eslint-disable quotes, quote-props */
import {
  join as pathJoin,
  dirname as pathDirname
} from 'path';
import {
  fileURLToPath as urlFileURLToPath
} from 'url';

const cjsDirname = pathDirname(urlFileURLToPath(import.meta.url));

const APP_PATHS = {
  appPathFsRoot: pathJoin(cjsDirname, 'compile/renderer-compile/'),
  appPathFsBuild: pathJoin(cjsDirname, 'compile/renderer-compile/assets-compiled/'),
  appPathFsIndex: pathJoin(cjsDirname, 'compile/renderer-compile/'),
  appPathUrlPathBuildRelativeToAppIndex: 'assets-compiled/'
};

export const APP_URL_TYPES = {
  // built assets are referenced from HTML using path from index(.html) location
  // i.e., 'assets/myscript.js'
  // i.e., './assets/myscript.js'
  RELATIVE_APP_INDEX: 'relative-app-index',
  // built assets are referenced from HTML using path from server root
  // i.e., '/assets/myscript.js'
  // i.e., '/path/above/server/root/assets/myscript.js'
  RELATIVE_SERVER_ROOT: 'relative-server-root',
  // built assets are referenced from HTML using absolute FQDN path
  // i.e., '//domain.tld/assets/myscript.js'
  // i.e., '//domain.tld/path/above/server/root/assets/myscript.js'
  ABSOLUTE_FQDN: 'absolute-fqdn'
  // *our HTML never uses <base> tag and sould never do
};

const CONFIG_RAW = {
  webpackBundleAnalyzer: {
    enable: false,
    options: {
      analyzerHost: '127.0.0.1',
      analyzerPort: 4001,
      openAnalyzer: true
    }
  },
  buildTiers: {
    wdsTier: {
      fqdnName: 'localhost',
      fqdnPort: 4000,
      fqdnTls: false,
      fqdnProtocolRelative: false,
      appPathUrlType: APP_URL_TYPES.ABSOLUTE_FQDN, // for wdsTier always ABSOLUTE_FQDN
      appPathUrlPathIndexAboveServerRoot: '/',
      ...APP_PATHS
    },
    development: {
      fqdnName: '',
      fqdnPort: 0,
      fqdnTls: false,
      fqdnProtocolRelative: false,
      appPathUrlType: APP_URL_TYPES.RELATIVE_APP_INDEX,
      appPathUrlPathIndexAboveServerRoot: '/',
      ...APP_PATHS
    },
    testing: {
      fqdnName: '',
      fqdnPort: 0,
      fqdnTls: false,
      fqdnProtocolRelative: false,
      appPathUrlType: APP_URL_TYPES.RELATIVE_APP_INDEX,
      appPathUrlPathIndexAboveServerRoot: '/',
      ...APP_PATHS
    },
    staging: {
      fqdnName: '',
      fqdnPort: 0,
      fqdnTls: false,
      fqdnProtocolRelative: false,
      appPathUrlType: APP_URL_TYPES.RELATIVE_APP_INDEX,
      appPathUrlPathIndexAboveServerRoot: '/',
      ...APP_PATHS
    },
    production: {
      fqdnName: '',
      fqdnPort: 0,
      fqdnTls: false,
      fqdnProtocolRelative: false,
      appPathUrlType: APP_URL_TYPES.RELATIVE_APP_INDEX,
      appPathUrlPathIndexAboveServerRoot: '/',
      ...APP_PATHS
    }
  },
  APP_URL_TYPES
};

export const warpConfigValidated = () => {
  (() => {
    Object.keys(CONFIG_RAW.buildTiers).forEach((tier) => {
      const currBuildTierProps = CONFIG_RAW.buildTiers[tier];

      if (!Object.values(APP_URL_TYPES).includes(currBuildTierProps.appPathUrlType)) {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'ERROR: Unknown appPathUrlType. Will not recover, aborting!');
        process.exit(1);
      }

      if (
        currBuildTierProps.appPathUrlType === APP_URL_TYPES.ABSOLUTE_FQDN &&
        !currBuildTierProps.fqdnName
      ) {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'ERROR: When appPathUrlType is APP_URL_TYPES.ABSOLUTE_FQDN, FQDN must not be empty. Will not recover, aborting!');
        process.exit(1);
      }

      if (!(
        currBuildTierProps.appPathUrlPathIndexAboveServerRoot.startsWith('/') &&
        currBuildTierProps.appPathUrlPathIndexAboveServerRoot.endsWith('/')
      )) {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'ERROR: appPathUrlPathIndexAboveServerRoot must not be empty and should start and end with "/". Valid examples: "/", "/path/", "/path/to/subdir/". Will not recover, aborting!');
        process.exit(1);
      }

      if ((
        currBuildTierProps.appPathUrlPathBuildRelativeToAppIndex &&
        (
          currBuildTierProps.appPathUrlPathBuildRelativeToAppIndex.startsWith('/') ||
          !currBuildTierProps.appPathUrlPathBuildRelativeToAppIndex.endsWith('/')
        )
      )) {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'ERROR: if appPathUrlPathBuildRelativeToAppIndex is not empty it must not start with "/" and must end with "/". Valid examples: "", "assets/", "long/path/to/dist/". Will not recover, aborting!');
        process.exit(1);
      }
    });
  })();
  return CONFIG_RAW;
};
