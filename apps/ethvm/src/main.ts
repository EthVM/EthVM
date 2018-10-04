import App from '@app/App.vue'
import colors from 'vuetify/es5/util/colors'

import socketConfig from '@app/configs/socket.json'
import router from '@app/router'
import store from '@app/states'
import i18n from '@app/translations'
import io from 'socket.io-client'
import VTooltip from 'v-tooltip'
import Vue from 'vue'
import infiniteScroll from 'vue-infinite-scroll'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Toasted from 'vue-toasted'

// EthVM Frames
// Main ----
import navigation from '@app/components/blocks/navigationDrawer/nav.vue'
import frameHome from '@app/components/frames/home.vue'
import frameBlocks from '@app/components/frames/blocks.vue'
import frameUncles from '@app/components/frames/uncles.vue'

import frameTxs from '@app/components/frames/transactions.vue'
import framePending from '@app/components/frames/pendingTxs.vue'
import frameAbout from '@app/components/frames/about.vue'

// Detail Frames -----
import frameBlockDetail from '@app/components/frames/blockDetail.vue'
import frameUncleDetail from '@app/components/frames/uncleDetail.vue'
import frameTxDetail from '@app/components/frames/txDetail.vue'
import frameTokenDetail from '@app/components/frames/tokenDetail.vue'
import frameAddress from '@app/components/frames/address.vue'

// Header ----------------------
import blockHeader from '@app/components/blocks/header/header.vue'
import mobileMenu from '@app/components/blocks/header/mobileMenu.vue'

// SMALL BLOCKS ----------------------
// Parent Small Block Component:
import blockComponent from '@app/components/blocks/smallBlocks/component.vue'
import footnote from '@app/components/blocks/smallBlocks/footnote.vue'

// Search Block:
import blockSearch from '@app/components/blocks/smallBlocks/search.vue'
import tabComponent from '@app/components/blocks/smallBlocks/tabComponent.vue'
import copyToClipComponent from '@app/components/blocks/smallBlocks/copyToClipComponent.vue'

// Home Page Small Blocks:
import blockLastBlock from '@app/components/blocks/smallBlocks/lastBlock.vue'
import blockDifficulty from '@app/components/blocks/smallBlocks/difficulty.vue'
import blockHashRate from '@app/components/blocks/smallBlocks/hashRate.vue'
import blockTimeSinceLastBlock from '@app/components/blocks/smallBlocks/timeSinceLastBlock.vue'

// Transactions Page Small Blocks:
import successfulTxSmallBlock from '@app/components/blocks/smallBlocks/successfulTxSmallBlock.vue'
import failedTxSmallBlock from '@app/components/blocks/smallBlocks/failedTxSmallBlock.vue'
import pendingTxSmallBlock from '@app/components/blocks/smallBlocks/pendingTxSmallBlock.vue'

// LARGE BLOCKS ----------------------
import blockLatestBlocks from '@app/components/blocks/largeBlocks/latestBlocks.vue'
import blockLatestUncles from '@app/components/blocks/largeBlocks/latestUncles.vue'
import blockLastTransactions from '@app/components/blocks/largeBlocks/lastTransactions.vue'
import blockAddressTxTable from '@app/components/blocks/largeBlocks/addressTxTable.vue'
import blockAbout from '@app/components/blocks/largeBlocks/about.vue'
import blockBlockDetail from '@app/components/blocks/largeBlocks/blockDetail.vue'
import addressDetail from '@app/components/blocks/largeBlocks/addressDetail.vue'
import blockaddressTx from '@app/components/blocks/largeBlocks/addressTx.vue'
import blockTxDetail from '@app/components/blocks/largeBlocks/txDetail.vue'
import blockTokenTracker from '@app/components/blocks/largeBlocks/tokenTracker.vue'
import blockTokenDetail from '@app/components/blocks/largeBlocks/blockTokenDetail.vue'

// Charts ----------------------
import vueChart from '@app/components/blocks/smallBlocks/charts/vuechart.vue'
import barChartLastTenBlocksTx from '@app/components/blocks/smallBlocks/charts/barchartlast10blockstx.vue'
import lineChartAveTxFees from '@app/components/blocks/smallBlocks/charts/linechartavetxfees.vue'
import frameCharts from '@app/components/frames/charts.vue'
import blockLastTenBlocksTx from '@app/components/blocks/smallBlocks/charts/lastTenBlocksTx.vue'
import topMinersChart from '@app/components/blocks/smallBlocks/charts/topMiners.vue'
import accountsCreated from '@app/components/blocks/smallBlocks/charts/accountsCreated.vue'
import avgBlockSize from '@app/components/blocks/smallBlocks/charts/aveBlockSize.vue'
import avgGasLimit from '@app/components/blocks/smallBlocks/charts/aveGasLimit.vue'
import avgTxFee from '@app/components/blocks/smallBlocks/charts/aveTxFees.vue'

// Footer ----------------------
import blockFooter from '@app/components/blocks/footer/footer.vue'

// Vue
// Main ----
Vue.component('navigation', navigation)
Vue.component('frame-home', frameHome)
Vue.component('frame-blocks', frameBlocks)
Vue.component('frame-uncles', frameUncles)

Vue.component('frame-txs', frameTxs)
Vue.component('frame-pending', framePending)
Vue.component('frame-about', frameAbout)

// Detail Frames -----
Vue.component('frame-block-detail', frameBlockDetail)
Vue.component('frame-uncle-detail', frameUncleDetail)
Vue.component('frame-tx-detail', frameTxDetail)
Vue.component('frame-token-detail', frameTokenDetail)
Vue.component('frame-address', frameAddress)

// Header ----------------------
Vue.component('block-header', blockHeader)
Vue.component('mobile-menu', mobileMenu)
// SMALL BLOCKS ----------------------
// Parent Small Block Component:
Vue.component('block-component', blockComponent)
Vue.component('footnote', footnote)

// Search Block:
Vue.component('block-search', blockSearch)
Vue.component('tab-component', tabComponent)
Vue.component('copy-to-clip-component', copyToClipComponent)

// Home Page Small Blocks:
Vue.component('block-last-block', blockLastBlock)
Vue.component('block-difficulty', blockDifficulty)
Vue.component('block-hash-rate', blockHashRate)
Vue.component('block-time-since-last-block', blockTimeSinceLastBlock)

// Transactions Page Small Blocks:
Vue.component('successful-tx-small-block', successfulTxSmallBlock)
Vue.component('failed-tx-small-block', failedTxSmallBlock)
Vue.component('pending-tx-small-block', pendingTxSmallBlock)

// LARGE BLOCKS ----------------------
Vue.component('block-latest-blocks', blockLatestBlocks)
Vue.component('block-latest-uncles', blockLatestUncles)
Vue.component('block-last-transactions', blockLastTransactions)
Vue.component('block-address-tx-table', blockAddressTxTable)
Vue.component('block-about', blockAbout)
Vue.component('block-block-detail', blockBlockDetail)
Vue.component('address-detail', addressDetail)
Vue.component('block-address-tx', blockaddressTx)
Vue.component('block-tx-detail', blockTxDetail)
Vue.component('block-token-tracker', blockTokenTracker)
Vue.component('block-token-detail', blockTokenDetail)

// Charts ----------------------
Vue.component('vue-chart', vueChart)
Vue.component('bar-chart-last-ten-blocks-tx', barChartLastTenBlocksTx)
Vue.component('line-chart-ave-tx-fees', lineChartAveTxFees)
Vue.component('frame-charts', frameCharts)
Vue.component('block-last-ten-blocks-tx', blockLastTenBlocksTx)
Vue.component('top-miners-chart', topMinersChart)
Vue.component('account-created-chart', accountsCreated)
Vue.component('block-size-chart', avgBlockSize)
Vue.component('gas-limit-chart', avgGasLimit)
Vue.component('tx-fee-chart', avgTxFee)

// Footer ----------------------
Vue.component('block-footer', blockFooter)

// Vue modules configuration
Vue.use(VTooltip)
Vue.prototype.$eventHub = new Vue()
Vue.config.productionTip = false
Vue.use(Toasted, {
  router
})
Vue.use(VueSocketio, io(socketConfig.url + ':' + socketConfig.port), store)
Vue.use(VueTimeago, {
  name: 'timeago',
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})
Vue.use(infiniteScroll)
Vue.use(Vuetify, {
  theme: {
    // used -->
    primary: '#3d55a5',
    secondary: '#2779ff',
    accent: '#4a67c6',
    success: '#20c0c7',
    warning: '#f9967b',
    info: '#a0a8fd'
    // used -->
    // background: String(colors.grey.darken3)
  }
})
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  data: {},
  components: {
    App
  }
})
