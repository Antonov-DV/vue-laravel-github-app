import Vue from 'vue'
import Router from 'vue-router'
import Repos from './views/Repos.vue'


Vue.use(Router);

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'repos',
      component: Repos
    },
  ]
});
export default router
