/**
 *  Webpack 基础配置.
 */

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const vueConfig = require('./vue-loader.config')
const projectConfig = require('../config')

const isProd = process.env.NODE_ENV === 'production'

// 读取配置生成 entry.
const entry = {
  vendor: [
    'axios',
    'es6-promise/auto',
    'es6-object-assign',
    'vue',
    'vuex',
    'vue-router',
    'vuex-router-sync'
  ]
}

Object.keys(projectConfig.pages).forEach(pageName => {
  entry[pageName] = projectConfig.pages[pageName].entry.client
})

const plugins = [
  new OptimizeCSSPlugin({
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
      autoprefixer: false
    }
  }),
  new ExtractTextPlugin('static/css/[name].[contenthash].css')
]

module.exports = {
  devtool: isProd ? false : '#cheap-module-eval-source-map',

  entry,

  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: isProd
      ? '/'
      : '/dist/',
    filename: 'static/js/[name].[chunkhash].js'
  },

  resolve: {
    alias: {
      'static': path.resolve(__dirname, '../static'),
      'vue$': 'vue/dist/vue.esm.js'
    },

    extensions: ['.js', '.vue', '.json']
  },

  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process

    // 经测试 style 类的 loader 写在通用 loader 下是可以使用的, 也可以只写在 client 下.
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig
      }, {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, '../src'),
        ]
      }, {
        test: /\.jade$/,
        loader: 'jade-loader'
      }, {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: isProd
          ? '/static/img/[name].[hash].[ext]'
          : 'static/img/[name].[hash].[ext]'
        }
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader'
        })
      }, {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!postcss-loader!stylus-loader'
        })
      }
    ]
  },

  performance: {
    maxEntrypointSize: 300000,
    hints: isProd ? 'warning' : false
  },

  plugins: isProd
    ? plugins.concat([])
    : plugins.concat([
      new FriendlyErrorsPlugin()
    ])
}
