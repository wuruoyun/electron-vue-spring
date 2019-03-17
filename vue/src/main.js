import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import interopFallback from './interop-fallback'

Vue.config.productionTip = false

Vue.prototype.$http = axios

const interop = window.interop || interopFallback
Vue.prototype.$interop = interop
Vue.prototype.$log = interop.log
Vue.$log = interop.log

Vue.$log.info('==========> Vue app start')

new Vue({
  render: h => h(App),
}).$mount('#app')
