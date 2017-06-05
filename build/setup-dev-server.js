const path = require('path')
const webpack = require('webpack')
const MFS = require('memory-fs')

const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const projectConfig = require('../config')

module.exports = function setupDevServer (app, cb) {
  /**
   * 项目所有 ssr-bundle 缓存对象.
   * ssr-bundle 将从此对象中读取.
   *
   * @example
   * bundles = {
   *   index: { ... },
   *   rank: { ... },
   *   detail: { ... },
   *   ...
   * }
   */
  let bundles = {}

  /**
   * 项目所有模板缓存对象.
   *
   * @example
   * templates = {
   *   index: { ... },
   *   rank: { ... },
   *   detail: { ... },
   *   ...
   * }
   */
  let templates = {}

  // 预先确定需要 SSR 的页面并预先定义对象.
  Object.keys(projectConfig.pages).forEach(pageName => {
    templates[pageName] = null
    bundles[pageName] = null
    // if (projectConfig.pages[pageName].useSSR) {
    //   bundles[pageName] = null
    // }
  })

  // 修改 Webpack 设置适配 HMR.
  Object.keys(clientConfig.entry).forEach(pageName => {
    if (pageName === 'vendor') { return }
    clientConfig.entry[pageName] = ['webpack-hot-middleware/client', clientConfig.entry[pageName]]
  })

  clientConfig.output.filename = '[name].js'

  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // Dev middleware.
  const clientCompiler = webpack(clientConfig)
  const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })

  app.use(devMiddleware)

  clientCompiler.plugin('done', () => {
    const fs = devMiddleware.fileSystem

    // 读取所有页面入口并生成模板.
    Object.keys(templates).forEach(pageName => {
      const tplFilePath = path.join(clientConfig.output.path, `${pageName}.html`)
      if (fs.existsSync(tplFilePath)) {
        try {
          templates[pageName] = fs.readFileSync(tplFilePath, 'utf-8')
        } catch (error) {
          console.error(`[Error] 读取页面 ${pageName} 页面失败:`)
          console.error(error)
          process.exit(1)
        }
      } else {
        console.warn(`[Warn] 页面 ${pageName} 的模板路径 ${tplFilePath} 不存在, 此页面将无模板生成.`)
      }
    })

    // 检查 bundles 内的项目是否全部载入完毕并执行回调.
    let doCallback = true
    Object.keys(bundles).some(pageName => {
      if (bundles[pageName] === null) {
        doCallback = false
        return true
      }
    })

    if (doCallback) {
      cb(bundles, templates)
    }
  })

  // Hot middleware.
  app.use(require('webpack-hot-middleware')(clientCompiler))

  // 建立每个页面的 serverCompiler.
  Object.keys(projectConfig.pages).forEach(pageName => {
    const webpackConfig = serverConfig[pageName]

    const serverCompiler = webpack(webpackConfig)
    const mfs = new MFS()
    serverCompiler.outputFileSystem = mfs

    serverCompiler.watch({}, (err, stats) => {
      if (err) throw err
      stats = stats.toJson()
      stats.errors.forEach(err => console.error(err))
      stats.warnings.forEach(err => console.warn(err))

      // 读取对应页面的 server-bundle.
      const bundlePath = path.join(webpackConfig.output.path, `ssr-bundle.${pageName}.json`)
      try {
        bundles[pageName] = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
      } catch (error) {
        console.error(`[Error] ssr-bundle.${pageName}.json 读取失败: ${error}`)
        process.exit(1)
      }

      // 检查模板是否全部读取完毕.
      let doCallback = true
      Object.keys(templates).some(pageName => {
        if (templates[pageName] === null) {
          doCallback = false
          return true
        }
      })

      if (doCallback) {
        cb(bundles, templates)
      }
    })
  })
}
