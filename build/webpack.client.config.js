/**
 *  Webpack 客户端配置. 本配置为 SSR 项目构建配置.
 */

const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const base = require('./webpack.base.config')
const projectConfig = require('../config')

const config = merge(base, {
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },

  plugins: [
    new webpack.DefinePlugin(Object.assign({}, projectConfig.env, {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': JSON.stringify('client')
    })),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    }),

    new VueSSRClientPlugin({
      filename: `static/ssr/manifest-ssr.json`
    })
  ]
})

// 读取页面配置生成 HTML 构建设置.
Object.keys(projectConfig.pages).forEach(pageName => {
  config.plugins.push(
    new HTMLPlugin({
      pageName,
      allowFiles: new RegExp(`${pageName}|manifest|vendor`),
      filename: pageName + '.html',
      template: projectConfig.pages[pageName].template,
      chunks: ['manifest', 'vendor', pageName],
    })
  )
})

// Production 环境.
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })

    // Service Worker.
    // new SWPrecachePlugin({
    //   cacheId: 'project-ssr-multi',
    //   filename: 'service-worker.js',
    //   dontCacheBustUrlsMatching: /./,
    //   staticFileGlobsIgnorePatterns: [/index\.html$/, /\.map$/]
    // })
  )
}

module.exports = config
