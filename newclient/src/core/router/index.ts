import Vue from 'vue'
import Router from 'vue-router'

const PageHome = () => import(/* webpackChunkName: "page-home" */ '@app/modules/home/pages/PageHome.vue')
const PageBlocks = () => import(/* webpackChunkName: "page-blocks" */ '@app/modules/blocks/pages/PageBlocks.vue')
const PageTxs = () => import(/* webpackChunkName: "page-txs" */ '@app/modules/txs/pages/PageTxs.vue')
// const PagePendingTxs = () => import(/* webpackChunkName: "page-pending-txs" */ '@app/modules/pending-txs/pages/PagePendingTxs.vue')
const PageAbout = () => import(/* webpackChunkName: "page-about" */ '@app/modules/other/pages/PageAbout.vue')
// const PageUncles = () => import(/* webpackChunkName: "page-uncles" */ '@app/modules/uncles/pages/PageUncles.vue')
const PageDetailsBlock = () => import(/* webpackChunkName: "page-details-block" */ '@app/modules/blocks/pages/PageDetailsBlock.vue')
const PageDetailsTxs = () => import(/* webpackChunkName: "page-details-txs" */ '@app/modules/txs/pages/PageDetailsTx.vue')
const PageDetailsAddress = () => import(/* webpackChunkName: "page-details-addr" */ '@app/modules/address/pages/PageDetailsAddress.vue')
const PageChartsList = () => import(/* webpackChunkName: "page-charts" */ '@app/modules/charts/pages/PageChartsList.vue')
const PageUniqueChart = () => import(/* webpackChunkName: "page-details-chart" */ '@app/modules/charts/pages/PageUniqueChart.vue')
const PageDetailsUncle = () => import(/* webpackChunkName: "page-details-uncle" */ '@app/modules/uncles/pages/PageDetailsUncle.vue')
const PageDetailsToken = () => import(/* webpackChunkName: "page-details-token" */ '@app/modules/tokens/pages/PageDetailsToken.vue')
const PageTokens = () => import(/* webpackChunkName: "page-tokens" */ '@app/modules/tokens/pages/PageTokes.vue')
const PageKnowledgeBase = () => import(/* webpackChunkName: "page-kb" */ '@app/modules/other/pages/PageKnowledgeBase.vue')
const PagePrivacyPolicy = () => import(/* webpackChunkName: "page-pp" */ '@app/modules/other/pages/PagePrivacyPolicy.vue')
const PageNotFound = () => import(/* webpackChunkName: "page-not-found" */ '@app/modules/other/pages/PageNotFound.vue')

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
            path: '/block/number/:blockRef',
            component: PageDetailsBlock,
            name: 'block',
            props: true
        },
        {
            path: '/block/hash/:blockRef',
            component: PageDetailsBlock,
            name: 'blockHash',
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
        // {
        //   path: '/pending-txs',
        //   component: PagePendingTxs,
        //   name: 'pending'
        // },
        // {
        //   path: '/uncles',
        //   component: PageUncles,
        //   name: 'uncles'
        // },
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
            component: PageChartsList,
            name: 'charts',
            props: true
        },
        {
            path: '/chart/:chartRef',
            component: PageUniqueChart,
            name: 'chart-detail',
            props: true
        },
        {
            path: '/token/:addressRef',
            component: PageDetailsToken,
            name: 'token-detail',
            props: true
        },
        {
            path: '/tokens',
            component: PageTokens,
            name: 'tokens'
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
        },
        {
            path: '/404',
            component: PageNotFound,
            name: 'notFound'
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    mode: 'hash'
})
