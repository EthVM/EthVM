import Vue from 'vue';
import Router from 'vue-router';
import NewHome from '@/components/NewHome/Home.vue';
import NewHomeParam from '@/components/NewHome/Home.vue';
import NewHomeRoot from '@/components/NewHome/Home.vue';
//import IndividualTransaction from '@/components/NewHome/Sections/SinglePages/IndividualTransaction.vue'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/:pageName/:param',
            name: 'NewHomeParam',
            component: NewHomeParam
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
});
//# sourceMappingURL=index.js.map