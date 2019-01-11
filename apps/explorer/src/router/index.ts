import Vue from 'vue'
import Router from 'vue-router'

//Import route layouts components:
import PageHome from '@/components/home/pages/PageHome.vue'
import PageBlocks from '@/components/blocks/pages/PageBlocks.vue'
import PageTxs from '@/components/txs/pages/PageTxs.vue'
import PagePendingTxs from '@/components/pending-txs/pages/PagePendingTxs.vue'
import PageAbout from '@/components/about/pages/PageAbout.vue'
import PageUncles from '@/components/uncles/pages/PageUncles.vue'
import PageDetailsBlock from '@/components/blocks/pages/PageDetailsBlock.vue'
import PageDetailsTxs from '@/components/txs/pages/PageDetailsTxs.vue'
import PageAddress from '@/components/addresses/pages/PageAddress.vue'
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
    },
    {
      path: '/txs',
      component: PageTxs,
      name: 'transactions'
    },
    {
      path: '/pending-txs',
      component: PagePendingTxs,
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
    },
    {
      path: '/address/:address',
      component: PageAddress,
      name: 'address',
      props: true
    }
  ],
  mode: 'history'
})
