import Vue from 'vue'
import Router from 'vue-router'

//Import route layouts components:
import PageHome from '@/components/pages/PageHome.vue'
import PageBlocks from '@/components/pages/PageBlocks.vue'
//import PageAddress from '@/components/pages/PageAddress.vue'
import PageTransactions from '@/components/pages/PageTransactions.vue'
import PagePendingTransactions from '@/components/pages/PagePendingTransactions.vue'
import PageAbout from '@/components/pages/PageAbout.vue'
import PageUncles from '@/components/pages/PageUncles.vue'
import PageDetailsBlock from '@/components/pages/PageDetailsBlock.vue'
import PageDetailsTxs from '@/components/pages/PageDetailsTxs.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: PageHome,
      name: 'home'
    },
    /*{
      path: '/address/:param',
      component: PageAddress,
      name: 'address'
    }, */
    {
      path: '/blocks',
      component: PageBlocks,
      name: 'blocks'
    },
    {
      path: '/transactions',
      component: PageTransactions,
      name: 'transactions'
    },
    {
      path: '/pending-transactions',
      component: PagePendingTransactions,
      name: 'pending'
    },
    {
      path: '/about',
      component: PageAbout,
      name: 'about'
    },
    {
      path: '/uncles',
      component: PageUncles,
      name: 'uncles'
    },
    {
      path: '/block/:blockRef',
      component: PageDetailsBlock,
      name: 'block',
      props: true
    },
    {
      path: '/tx/:txHash',
      component: PageDetailsTxs,
      name: 'transaction',
      props: true
    }
  ],
  mode: 'history'
})
