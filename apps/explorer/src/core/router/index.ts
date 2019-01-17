import Vue from 'vue'
import Router from 'vue-router'

import PageHome from '@app/modules/home/pages/PageHome.vue'
import PageBlocks from '@app/modules/blocks/pages/PageBlocks.vue'
import PageTxs from '@app/modules/txs/pages/PageTxs.vue'
import PagePendingTxs from '@app/modules/pending-txs/pages/PagePendingTxs.vue'
import PageAbout from '@app/modules/about/pages/PageAbout.vue'
import PageUncles from '@app/modules/uncles/pages/PageUncles.vue'
import PageDetailsBlock from '@app/modules/blocks/pages/PageDetailsBlock.vue'
import PageDetailsTxs from '@app/modules/txs/pages/PageDetailsTxs.vue'
import PageAddress from '@app/modules/addresses/pages/PageAddress.vue'
import PageCharts from '@app/modules/charts/pages/PageCharts.vue'
import PageChartID from '@app/modules/charts/pages/PageChartID.vue'
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
    },
    {
      path: '/charts',
      component: PageCharts,
      name: 'charts',
      props: true
    },
    {
      path: '/chart/:chartID',
      component: PageChartID,
      name: 'chartID',
      props: true
    }
  ],
  mode: 'history'
})
