import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import interopFallback from './interop-fallback'

Vue.config.productionTip = false

Vue.prototype.$http = axios
Vue.prototype.$interop = window.interop || interopFallback

new Vue({
  render: h => h(App),
}).$mount('#app')
