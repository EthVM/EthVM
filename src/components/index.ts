import Vue from 'vue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HpTxContainer from '@/components/HomePage/TxContainer'
import HpBlockContainer from '@/components/HomePage/blockContainer'
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