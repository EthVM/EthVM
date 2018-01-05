import Vue from 'vue'
import Router from 'vue-router'

import NewHome from '@/components/NewHome/Home.vue'
import NewHomeRoot from '@/components/NewHome/Home.vue'
import IndividualTransaction from '@/components/IndividualTransaction/IndividualTransaction.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/tx/:hash',
            name: 'IndividualTransaction',
            component: IndividualTransaction
        },
        {
            path: '/:pageName',
            name: 'NewHome',
            component: NewHome
        },
        {
            path: '/',
            name: 'NewHomeRoot',
            component: NewHomeRoot
        }
    ],
    mode: 'history'
})