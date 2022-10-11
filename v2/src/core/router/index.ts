import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME, Q_TOKEN_DETAILS, Q_BLOCKS_AND_TXS, Q_BLOCK_DETAILS, Q_TXS_DETAILS, Q_ADDRESS_TRANSFERS } from './routesNames'
import HomeView from '@view/ViewHome.vue'
import BlocksView from '@view/ViewBlocks.vue'
import BlocksAndTxsView from '@view/ViewBlocksAndTransactions.vue'
import TxDetailsView from '@view/ViewTxDetails.vue'
import BlockDetailsView from '@view/ViewBlockDetails.vue'
import UncleDetailsView from '@view/ViewUncleDetails.vue'
import TokenDetailsView from '@view/ViewTokenDetails.vue'
import TxsView from '@view/ViewTxs.vue'
import AddressTokensView from '@view/ViewAddressTokens.vue'
import ViewAddress from '@view/ViewAddress.vue'
import ViewAddressOverview from '@view/ViewAddressOverview.vue'
import ViewAddressMiners from '@view/ViewAddressMiners.vue'
import ViewAddressEthBalance from '@view/ViewAddressEthBalance.vue'
import ViewTokens from '@view/ViewTokens.vue'
import ViewAddressNfts from '@view/ViewAddressNfts.vue'
import ViewTemp from '@view/ViewTemp.vue'
import configs from '@/configs'
import { tabViewRouteGuard } from './helpers'
const routes: Array<RouteRecordRaw> = [
    {
        path: ROUTE_NAME.HOME.PATH,
        name: ROUTE_NAME.HOME.NAME,
        component: HomeView
    },
    {
        path: ROUTE_NAME.BLOCKS.PATH,
        name: ROUTE_NAME.BLOCKS.NAME,
        component: BlocksView
    },
    {
        path: ROUTE_NAME.ALL_BLOCKS_AND_TXS.PATH,
        name: ROUTE_NAME.ALL_BLOCKS_AND_TXS.NAME,
        component: BlocksAndTxsView,
        props: route => ({ tab: route.query.t }),
        beforeEnter: tabViewRouteGuard(Q_BLOCKS_AND_TXS[0])
    },
    {
        path: ROUTE_NAME.BLOCK_NUMBER.PATH,
        name: ROUTE_NAME.BLOCK_NUMBER.NAME,
        component: BlockDetailsView,
        props: route => ({ tab: route.query.t, blockRef: route.params.blockRef }),
        beforeEnter: tabViewRouteGuard(Q_BLOCK_DETAILS[0])
    },
    {
        path: ROUTE_NAME.BLOCK_HASH.PATH,
        name: ROUTE_NAME.BLOCK_HASH.NAME,
        component: BlockDetailsView,
        props: route => ({ tab: route.query.t, blockRef: route.params.blockRef }),
        beforeEnter: tabViewRouteGuard(Q_BLOCK_DETAILS[0])
    },
    {
        path: ROUTE_NAME.UNCLE_HASH.PATH,
        name: ROUTE_NAME.UNCLE_HASH.NAME,
        component: UncleDetailsView,
        props: true
    },
    {
        path: ROUTE_NAME.TXS.PATH,
        name: ROUTE_NAME.TXS.NAME,
        component: TxsView
    },
    {
        path: ROUTE_NAME.TX_HASH.PATH,
        name: ROUTE_NAME.TX_HASH.NAME,
        component: TxDetailsView,
        props: route => ({ tab: route.query.t, txRef: route.params.txRef }),
        beforeEnter: tabViewRouteGuard(Q_TXS_DETAILS[0])
    },
    {
        path: ROUTE_NAME.TXS_PENDING.PATH,
        name: ROUTE_NAME.TXS_PENDING.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.TOKEN.PATH,
        name: ROUTE_NAME.TOKEN.NAME,
        component: TokenDetailsView,
        props: true,
        beforeEnter: tabViewRouteGuard(Q_TOKEN_DETAILS[0])
    },
    {
        path: ROUTE_NAME.CHARTS.PATH,
        name: ROUTE_NAME.CHARTS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.ADDRESS.PATH,
        props: true,
        component: ViewAddress,
        children: [
            {
                path: '',
                name: ROUTE_NAME.ADDRESS.NAME,
                component: ViewAddressOverview,
                props: true
            },
            {
                path: ROUTE_NAME.ADDRESS_BALANCE.PATH,
                name: ROUTE_NAME.ADDRESS_BALANCE.NAME,
                component: ViewAddressEthBalance,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(Q_ADDRESS_TRANSFERS[0])
            },
            {
                path: ROUTE_NAME.ADDRESS_TOKENS.PATH,
                name: ROUTE_NAME.ADDRESS_TOKENS.NAME,
                component: AddressTokensView,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(ADDRESS_ROUTE_QUERY.Q_TOKENS[0])
            },
            {
                path: ROUTE_NAME.ADDRESS_NFTS.PATH,
                name: ROUTE_NAME.ADDRESS_NFTS.NAME,
                component: ViewAddressNfts,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(ADDRESS_ROUTE_QUERY.Q_NFTS[0])
            },
            {
                path: ROUTE_NAME.ADDRESS_CONTRACT.PATH,
                name: ROUTE_NAME.ADDRESS_CONTRACT.NAME,
                component: ViewTemp,
                props: true
            },
            {
                path: ROUTE_NAME.ADDRESS_MINER.PATH,
                name: ROUTE_NAME.ADDRESS_MINER.NAME,
                component: ViewAddressMiners,
                props: route => ({ tab: route.query.t }),
                beforeEnter: tabViewRouteGuard(ADDRESS_ROUTE_QUERY.Q_MINER[0])
            }
        ]
    },

    {
        path: ROUTE_NAME.FAV_ADDRESS.PATH,
        name: ROUTE_NAME.FAV_ADDRESS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.FAV_TOKENS.PATH,
        name: ROUTE_NAME.FAV_TOKENS.NAME,
        component: ViewTemp
    },
    {
        path: ROUTE_NAME.TOKENS.PATH,
        name: ROUTE_NAME.TOKENS.NAME,
        component: ViewTokens
    }
]

const router = createRouter({
    history: configs.ROUTER_MODE === 'hash' ? createWebHashHistory() : createWebHistory(),
    routes
})

export default router
