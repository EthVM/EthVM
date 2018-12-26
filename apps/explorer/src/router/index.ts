import Vue from 'vue'
import Router from 'vue-router'
//Import route layouts components:
import PageHome from '@/components/pages/PageHome.vue'
import PageBlocks from '@/components/pages/PageBlocks.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: PageHome,
      name: 'home'
    },
    {
      path: '/blocks',
      component: PageBlocks,
      name: 'blocks'
    }
    /*{
      path: '/:pageName',
      component: HomeRouter
    },
    {
      path: '/:pageName/:param',
      component: HomeRouter
    },
    {
      path: '/:pageName/:param/holder=:holder',
      name: 'token',
      component: HomeRouter
    } */
  ],
  mode: 'history'
})
