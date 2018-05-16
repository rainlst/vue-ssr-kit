/**

 *  Webpack 客户端配置. 本配置为 SSR 项目构建配置.
 */

const webpack = require('webpack')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const VueSSRPlugin = require('vue-ssr-webpack-plugin')

const baseConfig = require('./webpack.base.config')
const projectConfig = require('../config')

// 每个页面的 Webpack 配置.
const webpackConfigOfEveryPage = {}

// 循环页面列表分别打包.
Object.keys(projectConfig.pages).forEach(pageName => {
  const pageConfig = projectConfig.pages[pageName]

  if (!pageConfig.template) {
    return console.warn(`[Warn] 页面 ${pageName} 未定义模板入口, 将不进行构建.`)
  }

  webpackConfigOfEveryPage[pageName] = merge(baseConfig, {
    target: 'node',

    devtool: '#source-map',

    entry: pageConfig.entry.server,

    output: {
      filename: 'ssr-bundle.[name].js',
      libraryTarget: 'commonjs2'
    },

    resolve: {
      alias: {
        'create-api': './create-api-server.js'
      }
    },

    // externals: Object.keys(require('../package.json').dependencies),

    plugins: [
      new webpack.DefinePlugin(Object.assign({}, projectConfig.env, {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': JSON.stringify('server')
      })),

      new VueSSRPlugin({
        filename: `./static/ssr/ssr-bundle.${pageName}.json`
      })
    ]
  })
})

module.exports = webpackConfigOfEveryPage
