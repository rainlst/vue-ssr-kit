import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
// import titleMixin from '../../utils/title'

// mixin for handling title
// Vue.mixin(titleMixin)

const store = createStore()
const app = new Vue({
  store,
  render (h) {
    return h(App)
  }
})
export {
  app,
  store
}
