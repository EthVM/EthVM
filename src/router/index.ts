import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/Home.vue'
import LatestBlocks from '@/components/LatestBlocks/LatestBlocks.vue'
import Block from '@/components/Block/Block.vue'
import IndividualTransaction from '@/components/IndividualTransaction/IndividualTransaction.vue'
import LatestTransaction from '@/components/LatestTransaction/LatestTransaction.vue'
import SingleAccount from '@/components/SingleAccount/SingleAccount.vue'


Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'HomePage',
		component: HomePage
	},
    {
        path: '/latestblocks',
        name: 'LatestBlocks',
        component: LatestBlocks
    },
    {
        path: '/block/:hash',
        name: 'Block',
        component: Block
    },
    {
        path: '/tx',
        name: 'IndividualTransaction',
        component: IndividualTransaction
    },
    {
        path: '/latesttransaction',
        name: 'LatestTransaction',
        component: LatestTransaction
    },
    {
        path: '/singleaccount',
        name: 'SingleAccount',
        component: SingleAccount
    }],
    mode: 'history'
})