import {app} from './app'

export default context => {
  return new Promise((resolve, reject) => {
    resolve(app)
  })
}
