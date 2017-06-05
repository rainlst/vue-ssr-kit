/**
 *  项目构建配置文件.
 */
const path = require('path')
const version = require('../package.json').version
const resolve = dir => path.resolve(__dirname, '../' + dir)

// 项目变量.
const env = {
  'process.env.APPNAME': JSON.stringify('Project SSR Multi Template'),
  'process.env.BUILD_TIME': JSON.stringify(new Date()),
  'process.env.VERSION': JSON.stringify(version)
}

// 项目页面定义.
// 供 Webpack 构建 HTML、项目构建路由使用.
const pages = {
  index: {
    entry: {
      client: resolve('src/pages/index/entry-client.js'),
      server: resolve('src/pages/index/entry-server.js')
    },
    template: resolve('src/pages/index/index.html'),
    url: '/',
    useSSR: true
  },

  detail: {
    entry: {
      client: resolve('src/pages/detail/entry-client.js'),
      server: resolve('src/pages/detail/entry-server.js')
    },
    template: resolve('src/pages/detail/index.html'),
    url: '/detail/:id',
    useSSR: true
  }
}

module.exports = {
  env,
  pages
}
