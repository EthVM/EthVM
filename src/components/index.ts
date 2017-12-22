import Vue from 'vue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HpTxContainer from '@/components/HomePage/TxContainer'
import HpBlockContainer from '@/components/HomePage/blockContainer'

import LatestBlocks from '@/components/LatestBlocks/LatestBlocks'
import Block from '@/components/Block/Block'

import LatestTransaction from '@/components/LatestTransaction/LatestTransaction'
import TxPagination from '@/components/LatestTransaction/TxPagination'

import IndividualTransaction from '@/components/IndividualTransaction/IndividualTransaction'
import SingleAccount from '@/components/SingleAccount/SingleAccount'

import TopNav from "@/components/TopNav"
import * as Icon from 'vue-awesome'
import 'vue-awesome/icons'

/* eslint-disable no-new */
Vue.component('icon', Icon)
Vue.component('Header', Header)
Vue.component('Footer', Footer)
Vue.component('hp-tx-container', HpTxContainer)
Vue.component('hp-block-container', HpBlockContainer)
Vue.component('topnav', TopNav)
Vue.component('LatestBlocks', LatestBlocks)
Vue.component('Block', Block)

Vue.component('LatestTransaction', LatestTransaction)
Vue.component('TxPagination', TxPagination)

Vue.component('IndividualTransaction', IndividualTransaction)
Vue.component('SingleAccount', SingleAccount)



