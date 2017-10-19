import HomePage from './pages/HomePage.vue';

export default [
  { path: '/home', component: HomePage },
  { path: '*', redirect: '/home' }
]
