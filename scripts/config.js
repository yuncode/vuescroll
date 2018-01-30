const path = require('path')
const version = process.env.VERSION || require('../package.json').version
 
const banner =
   `/*
    * @name: vuescroll ${version}
    * @author: (c) 2018-${new Date().getFullYear()} wangyi7099
    * @description: A virtual scrollbar based on vue.js 2.x inspired by slimscroll
    * @license: MIT
    * @GitHub: https://github.com/wangyi7099/vuescroll
    */
   `;

const aliases = require('./alias')

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const builds = {
  // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuescroll.js'),
    format: 'umd',
    env: 'development',
    external: ['vue'],
    banner
  },
  // Runtime+compiler production build  (Browser)
  'web-full-prod': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuescroll.min.js'),
    format: 'umd',
    env: 'production',
    external: ['vue'],
    banner
  },
  // Runtime+compiler CommonJS build (ES Modules)
  'web-full-esm': {
    entry: resolve('src/index.esm.js'),
    dest: resolve('dist/vuescroll.esm.js'),
    format: 'es',
    banner
  },
  // Runtime+compiler CommonJS build (CommonJS)
  'web-full-cjs': {
    entry: resolve('src/index.js'),
    dest: resolve('dist/vuescroll.common.js'),
    format: 'cjs',
    external: ['vue'],
    banner
  }
}

function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    output: {
      globals: {
        vue: 'vue'
      },
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'vuescroll'
    }
  }

   

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}