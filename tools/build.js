/**
 * Babel Starter Kit (https://www.kriasoft.com/babel-starter-kit)
 *
 * Copyright © 2015-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const pkg = require('../package.json');

let promise = Promise.resolve();


// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
['es', 'cjs', 'umd'].forEach((format) => {
  promise = promise.then(() => rollup.rollup({
    entry: 'src/index.js',
    external: Object.keys(pkg.dependencies).concat(Object.keys(pkg.peerDependencies)),
    plugins: [babel(Object.assign(pkg.babel, {
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true, // because we use transform-runtime plugin (avoid repetition)
      presets: pkg.babel.presets.map(x => (x === 'latest' ? ['latest', { es2015: { modules: false } }] : x)),
    }))],
  })
  .then(bundle => bundle.write({
    dest: `dist/${format === 'cjs' ? 'index' : `index.${format}`}.js`,
    format,
    sourceMap: true,
    moduleName: format === 'umd' ? pkg.name : undefined,
  })));
});

// Copy typings file to dist.
promise = promise.then(() => {
  const typingsFile = fs.readFileSync(path.resolve(__dirname, '..', 'src', 'index.d.ts'), { encoding: 'utf-8' });
  fs.writeFileSync(path.resolve(__dirname, '..', 'dist', 'index.d.ts'), typingsFile, 'utf-8');
});
