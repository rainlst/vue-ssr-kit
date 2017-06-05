# Vue Multi Projects template with SSR Feature.

> 

Vue SSR 多项目模板.

## 模板特性

 - Vue SSR + Express 单项目统一构建.
 - 支持传统多页面构建.
 - 前端生成代码可使用 Node 部署为 SSR, 也可直接在 nginx 等静态服务器部署.
 - 语法支持至 ES2016.
 
## Quick Start.

1. `git clone` || `hime-tech init project-ssr-multi new-project
2. `yarn install or npm install`
3. `npm run dev`


## 注意事项

 - 页面入口模板文件**必须**为 HTML 格式, 暂不兹词其他模板.
 - 页面入口模板必须有一个容器, 将 `vue-ssr-outlet` 放置至此容器中, 然后 Vue 根视图对象需要 Mount 至此容器之上.
 
