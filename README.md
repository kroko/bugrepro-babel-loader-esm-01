# bugrepro-babel-loader-esm-01

References https://github.com/babel/babel-loader/issues/894  

Pardon for messy structure in context of simple bug reproduction. This is an Electron project and I tried to keep the tree the same for better reproduction. Things are stripped out though.

## Reproduce

```sh
# install deps
npm install
```

### Build without ESM

```sh
# webpack buld
npm run renderer:build:dev
```

Open `compile/renderer-compile/index.html`

### Switch to ESM

Looking only at `babelrc` for renderer side `app-renderer/.babelrc.js`)  
Leaving alone `app-main/.babelrc.js` as that would require bringing in all Electron for reproductions.

```sh
# rename
mv \
app-renderer/.babelrc.js \
app-renderer/.babelrc.mjs

# change "module.exports = {" to ""export default {"
# N.B., this is macOS sed flavour
sed -i '' 's/module\.exports =/export default/' app-renderer/.babelrc.mjs

# webpack buld
npm run renderer:build:dev
```

```
 0:0  error  Parsing error: /path/to/bugrepro-babel-loader-esm-01/app-renderer/.babelrc.mjs: Error while loading config - You appear to be using a native ECMAScript module configuration file, which is only supported when running Babel asynchronously
```
