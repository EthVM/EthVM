import Vue from 'vue'
import Router from 'vue-router'

import HomeRouter from '@/components/index.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: HomeRouter
        },
        {
            path: '/:pageName',
            component: HomeRouter
        },
        {
            path: '/:pageName/:param',
            component: HomeRouter
        },
        {
            path: '/:pageName/:param/holder=:holder',
            name:'token',
            component: HomeRouter
        }

    ],
    mode: 'history'
})