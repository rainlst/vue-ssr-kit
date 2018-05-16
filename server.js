/**
 *  Vue SSR 项目模板.
 */

const fs = require('fs')
const path = require('path')
const express = require('express')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)

const app = express()

const isProd = process.env.NODE_ENV === 'production'
const projectConfig = require('./config')
const pagesList = Object.keys(projectConfig.pages)

global.renderers = {}

if (isProd) {
  // 生产环境下读取 dist 下的 vue-ssr-bundle.json 文件进行渲染.
  // bundle 文件由 vue-ssr-webpack-plugin 生成.
  // HTML 文件由 html-webpack-plugin 生成.

  // 读取页面配置并生成 bundle 与 template.
  pagesList.forEach(pageName => {
    const pageConfig = projectConfig.pages[pageName]
    if (!pageConfig.useSSR) { return }
    const bundle = require(resolve(`./dist/static/ssr/ssr-bundle.${pageName}.json`))
    try {
      const template = fs.readFileSync(resolve(`./dist/${pageName}.html`), 'utf-8')
      global.renderers[pageName] = createRenderer(bundle, template)
    } catch (error) {
      console.error(`[Error] 读取页面 ${pageName} 模板文件失败: ${error}`)
      process.exit(1)
    }
  })
} else {
  // 开发环境: 使用 webpack-dev-server 与 hot-dev-middleware 进行文件服务.
  require('./build/setup-dev-server')(app, (bundles, templates) => {
    // 循环 bundles 生成 renderers.
    // 请注意 templates 中一定含有 bundles, 而 bundles 中不一定含有 templates.
    Object.keys(bundles).forEach(pageName => {
      global.renderers[pageName] = createRenderer(bundles[pageName], templates[pageName])
    })
  })
}

// 设置 Express.
app.use(compression({ threshold: 0 }))

// 注册静态文件目录.
app.use('/dist', serve('./dist', true))
app.use('/static', serve('./static', true))
app.use('/manifest.json', serve('./manifest.json', true))
app.use('/service-worker.js', serve('./dist/service-worker.js'))

// 初始化路由.
require('./router')(app)

// 启动服务.
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})

/**
 * 渲染器生成函数.
 *
 * @param bundle
 * @param template
 * @return {*}
 */
function createRenderer (bundle, template) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  return require('vue-server-renderer').createBundleRenderer(bundle, {
    template,
    inject: false,
    cache: require('lru-cache')({
      max: 1000,
      maxAge: 1000 * 60 * 15
    })
  })
}

/**
 * 静态文件服务函数.
 *
 * @param path
 * @param cache
 * @return {*}
 */
function serve (path, cache) {
  return express.static(resolve(path), {
    maxAge: cache && isProd ? 60 * 60 * 24 * 30 : 0
  })
}
