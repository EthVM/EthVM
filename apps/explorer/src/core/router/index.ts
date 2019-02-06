import Vue from 'vue'
import Router from 'vue-router'

import PageHome from '@app/modules/home/pages/PageHome.vue'
import PageBlocks from '@app/modules/blocks/pages/PageBlocks.vue'
import PageTxs from '@app/modules/txs/pages/PageTxs.vue'
import PagePendingTxs from '@app/modules/pending-txs/pages/PagePendingTxs.vue'
import PageAbout from '@app/modules/other/pages/PageAbout.vue'
import PageUncles from '@app/modules/uncles/pages/PageUncles.vue'
import PageDetailsBlock from '@app/modules/blocks/pages/PageDetailsBlock.vue'
import PageDetailsTxs from '@app/modules/txs/pages/PageDetailsTxs.vue'
import PageDetailsAddress from '@app/modules/addresses/pages/PageDetailsAddress.vue'
import PageCharts from '@app/modules/charts/pages/PageCharts.vue'
import PageDetailsChart from '@app/modules/charts/pages/PageDetailsChart.vue'
import PageDetailsUncle from '@app/modules/uncles/pages/PageDetailsUncle.vue'
import PageTokens from '@app/modules/tokens/pages/PageTokens.vue'
import PageDetailsToken from '@app/modules/tokens/pages/PageDetailsToken.vue'
import PageKnowledgeBase from '@app/modules/other/pages/PageKnowledgeBase.vue'
import PagePrivacyPolicy from '@app/modules/other/pages/PagePrivacyPolicy.vue'

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
      path: '/block/:blockRef',
      component: PageDetailsBlock,
      name: 'block',
      props: true
    },
    {
      path: '/txs',
      component: PageTxs,
      name: 'transactions'
    },
    {
      path: '/tx/:txRef',
      component: PageDetailsTxs,
      name: 'transaction',
      props: true
    },
    {
      path: '/pending-txs',
      component: PagePendingTxs,
      name: 'pending'
    },
    {
      path: '/uncles',
      component: PageUncles,
      name: 'uncles'
    },
    {
      path: '/uncle/:uncleRef',
      component: PageDetailsUncle,
      name: 'uncle',
      props: true
    },
    {
      path: '/address/:addressRef',
      component: PageDetailsAddress,
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
      path: '/chart/:chartRef',
      component: PageDetailsChart,
      name: 'chart-detail',
      props: true
    },
    {
      path: '/tokens',
      component: PageTokens,
      name: 'tokens'
    },
    {
      path: '/token/:addressRef',
      component: PageDetailsToken,
      name: 'token-detail',
      props: true
    },
    {
      path: '/about',
      component: PageAbout,
      name: 'about'
    },
    {
      path: '/privacy_policy',
      component: PagePrivacyPolicy,
      name: 'privacy'
    },
    {
      path: '/knowledge_base',
      component: PageKnowledgeBase,
      name: 'kb'
    }
  ],
  mode: 'history'
})
