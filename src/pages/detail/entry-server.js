import { app, store } from './app'

// wait until  has resolved possible async hooks  prefetch all data
async function prefetch (context) {
  // console.log(context) // to get url router
  await new Promise((resolve, reject) => {
    setTimeout(function () {
      context.title='hello title'
      store.state.test = 'ssr from store'
      console.log('run in prefetch')
      resolve('success')
    }, 200);
  })
}

export default async context => {
  await prefetch(context)
  return await new Promise((resolve, reject) => {

    context.state = store.state
    resolve(app)
  })
}
