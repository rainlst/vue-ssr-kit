import 'es6-promise/auto'
import { polyfill as objectAssignPolyfill } from 'es6-object-assign'

import Vue from 'vue'



import { app } from './app'

const clientVM = new Vue({
  components: {
    
  }
})

objectAssignPolyfill()

clientVM.$mount('#client-content')
app.$mount('#ssr-content')
