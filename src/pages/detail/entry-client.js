import 'es6-promise/auto'
import { polyfill as objectAssignPolyfill } from 'es6-object-assign'
import Vue from 'vue'
objectAssignPolyfill()


import { app, store } from './app'
// the state is determined during SSR and inlined in the page markup.

app.$mount('#ssr-content')


// -----------------------below run in client

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
const clientVM = new Vue({
  template: "<div>client!</div>"
})
clientVM.$mount('#client-content')
