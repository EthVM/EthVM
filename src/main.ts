import Vue from 'vue'
import Toasted from 'vue-toasted'
import VueSocketio from 'vue-socket.io'
import VueTimeago from 'vue-timeago'
import VTooltip from 'v-tooltip'
import infiniteScroll from 'vue-infinite-scroll'

import io from 'socket.io-client'

import router from '@/router'
import store from '@/states'
import i18n from '@/translations'

import socketConfig from '@/configs/socket.json'

// Vue components
import App from '@/App.vue'
import blockHeader from '@/components/blocks/header/header.vue'
import frameHome from '@/components/frames/home.vue'
import frameBlocks from '@/components/frames/blocks.vue'
import frameTxs from '@/components/frames/transactions.vue'
import framePending from '@/components/frames/pendingTxs.vue'
import frameAbout from '@/components/frames/about.vue'
import frameBlockDetail from '@/components/frames/blockDetail.vue'
import frameTxDetail from '@/components/frames/txDetail.vue'
import frameTokenDetail from '@/components/frames/tokenDetail.vue'
import frameAddress from '@/components/frames/address.vue'
import blockModal from '@/components/blocks/modal/modal.vue'
import blockComponent from '@/components/blocks/smallBlocks/component.vue'
import blockSearch from '@/components/blocks/smallBlocks/search.vue'
import tabComponent from '@/components/blocks/smallBlocks/tabComponent.vue'
import copyToClipComponent from '@/components/blocks/smallBlocks/copyToClipComponent.vue'
import blockLastBlock from '@/components/blocks/smallBlocks/lastBlock.vue'
import blockDifficulty from '@/components/blocks/smallBlocks/difficulty.vue'
import blockHashRate from '@/components/blocks/smallBlocks/hashRate.vue'
import blockTimeSinceLastBlock from '@/components/blocks/smallBlocks/timeSinceLastBlock.vue'
import successfulTxSmallBlock from '@/components/blocks/smallBlocks/successfulTxSmallBlock.vue'
import failedTxSmallBlock from '@/components/blocks/smallBlocks/failedTxSmallBlock.vue'
import pendingTxSmallBlock from '@/components/blocks/smallBlocks/pendingTxSmallBlock.vue'
import blockLatestBlocks from '@/components/blocks/largeBlocks/latestBlocks.vue'
import blockLastTransactions from '@/components/blocks/largeBlocks/lastTransactions.vue'
import blockAddressTxTable from '@/components/blocks/largeBlocks/addressTxTable.vue'
import blockAbout from '@/components/blocks/largeBlocks/about.vue'
import blockBlockDetail from '@/components/blocks/largeBlocks/blockDetail.vue'
import addressDetail from '@/components/blocks/largeBlocks/addressDetail.vue'
import blockaddressTx from '@/components/blocks/largeBlocks/addressTx.vue'
import blockTxDetail from '@/components/blocks/largeBlocks/txDetail.vue'
import blockTokenTracker from '@/components/blocks/largeBlocks/tokenTracker.vue'
import blockTokenDetail from '@/components/blocks/largeBlocks/blockTokenDetail.vue'
import blockPendingTxs from '@/components/blocks/largeBlocks/pendingTxs.vue'
import vueChart from '@/components/blocks/smallBlocks/charts/vuechart.vue'
import barChartLastTenBlocksTx from '@/components/blocks/smallBlocks/charts/barchartlast10blockstx.vue'
import lineChartAveTxFees from '@/components/blocks/smallBlocks/charts/linechartavetxfees.vue'
import frameCharts from '@/components/frames/charts.vue'
import blockLastTenBlocksTx from '@/components/blocks/smallBlocks/charts/lastTenBlocksTx.vue'
import topMinersChart from '@/components/blocks/smallBlocks/charts/topMiners.vue'
import accountsCreated from '@/components/blocks/smallBlocks/charts/accountsCreated.vue'
import avgBlockSize from '@/components/blocks/smallBlocks/charts/aveBlockSize.vue'
import avgGasLimit from '@/components/blocks/smallBlocks/charts/aveGasLimit.vue'
import avgTxFee from '@/components/blocks/smallBlocks/charts/aveTxFees.vue'
import blockFooter from '@/components/blocks/footer/footer.vue'

// FRAMES
// Header
Vue.component('block-header', blockHeader)

// Main
Vue.component('frame-home', frameHome)
Vue.component('frame-blocks', frameBlocks)
Vue.component('frame-txs', frameTxs)
Vue.component('frame-pending', framePending)
Vue.component('frame-about', frameAbout)

// Detail Frames
Vue.component('frame-block-detail', frameBlockDetail)
Vue.component('frame-tx-detail', frameTxDetail)
Vue.component('frame-token-detail', frameTokenDetail)
Vue.component('frame-address', frameAddress)

// Modal
Vue.component('block-modal', blockModal)

// SMALL BLOCKS
// Parent Small Block Component:
Vue.component('block-component', blockComponent)

// Search Block
Vue.component('block-search', blockSearch)
Vue.component('tab-component', tabComponent)
Vue.component('copy-to-clip-component', copyToClipComponent)

// Home Page Small Blocks
Vue.component('block-last-block', blockLastBlock)
Vue.component('block-difficulty', blockDifficulty)
Vue.component('block-hash-rate', blockHashRate)
Vue.component('block-time-since-last-block', blockTimeSinceLastBlock)

// Transactions Page Small Blocks
Vue.component('successful-tx-small-block', successfulTxSmallBlock)
Vue.component('failed-tx-small-block', failedTxSmallBlock)
Vue.component('pending-tx-small-block', pendingTxSmallBlock)

// LARGE BLOCKS
Vue.component('block-latest-blocks', blockLatestBlocks)
Vue.component('block-last-transactions', blockLastTransactions)
Vue.component('block-address-tx-table', blockAddressTxTable)
Vue.component('block-about', blockAbout)
Vue.component('block-block-detail', blockBlockDetail)
Vue.component('address-detail', addressDetail)
Vue.component('block-address-tx', blockaddressTx)
Vue.component('block-tx-detail', blockTxDetail)
Vue.component('block-token-tracker', blockTokenTracker)
Vue.component('block-token-detail', blockTokenDetail)
Vue.component('block-pending-txs', blockPendingTxs)

// Charts
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

// Footer
Vue.component('block-footer', blockFooter)

// Vue config
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

// Kickstart app
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
