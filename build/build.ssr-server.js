/**
 *  SSR 服务器端构建命令.
 */

const webpack = require('webpack')
const webpackConfigOfEveryPage = require('./webpack.server.config')

// 循环页面列表分别打包.
Object.keys(webpackConfigOfEveryPage).forEach(pageName => {
  const webpackConfig = webpackConfigOfEveryPage[pageName]

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      throw new Error(err)
    }

    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
})
