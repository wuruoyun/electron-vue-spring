import Vue from 'vue';
import VueRouter from 'vue-router';
import axios from 'axios';
import App from './App.vue';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
})

Vue.prototype.$http = axios;
Vue.prototype.$interop = window.interop;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
