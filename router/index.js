/**
 *  路由模块.
 */

const express = require('express')
const projectConfig = require('../config')

module.exports = function (app) {
  // 根据配置生成页面路由.
  // 如果有个性化路由则拆开编写.
  Object.keys(projectConfig.pages).forEach(pageName => {
    const url = projectConfig.pages[pageName].url

    app.get(url, (req, res) => {
      const renderer = global.renderers[pageName]
      if (!renderer) {
        return res.end(`
        <h1>请稍等片刻...</h1>
        <p>马上将为您跳转页面哦...</p>
        <script>
          setTimeout(function() { window.location.reload() }, 5000)
        </script>
      `)
      }

      res.setHeader('Content-Type', 'text/html')

      const startTime = Date.now()

      /**
       * 上下文对象, 用于和视图交换数据.
       */
      const context = {
        url: req.url
      }

      renderer.renderToStream(context)
        .on('error', errorHandler)
        .on('end', () => console.log(`whole request: ${Date.now() - startTime}ms`))
        .pipe(res)


      /**
       * 页面错误处理函数.
       *
       * @param error
       */
      function errorHandler (error) {
        console.log('[Error] 渲染页面出错: ', error)

        if (error && error.code === 404) {
          res.status(404).end('404 | Page Not Found')
        } else {
          // Render Error Page or Redirect
          res.status(500).end('500 | Internal Server Error')
          console.error(`error during render : ${req.url}`)
          console.error(error)
        }
      }
    })
  })
}

