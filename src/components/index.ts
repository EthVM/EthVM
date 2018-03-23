import Vue from 'vue'

  /* Frames ---------------------- */
  import frameHome from "@/components/frames/home"
  Vue.component('frame-home', frameHome)

  import frameBlocks from "@/components/frames/blocks"
  Vue.component('frame-blocks', frameBlocks)

  import frameTxs from "@/components/frames/transactions"
  Vue.component('frame-txs', frameTxs)

  import frameAbout from "@/components/frames/about"
  Vue.component('frame-about', frameAbout)

  import frameBlockDetail from "@/components/frames/blockDetail"
  Vue.component('frame-block-detail', frameBlockDetail)

  import frameAccount from "@/components/frames/account"
  Vue.component('frame-account', frameAccount)

  import framePending from "@/components/frames/pendingTxs"
  Vue.component('frame-pending', framePending)

  /* Header ---------------------- */
  import blockHeader from "@/components/blocks/header/header"
  Vue.component('block-header', blockHeader)



  /* Modal ---------------------- */
  import blockModal from "@/components/blocks/modal/modal"
  Vue.component('block-modal', blockModal)



  /* SMALL BLOCKS ---------------------- */

  /* Parent Small Block Component: */
  import blockComponent from "@/components/blocks/smallBlocks/component"
  Vue.component('block-component', blockComponent)


  /* Search Block: */
  import blockSearch from "@/components/blocks/smallBlocks/search"
  Vue.component('block-search', blockSearch)


  /* Home Page Small Blocks: */
  import blockLastBlock from "@/components/blocks/smallBlocks/lastBlock"
  Vue.component('block-last-block', blockLastBlock)

  import blockDifficulty from "@/components/blocks/smallBlocks/difficulty"
  Vue.component('block-difficulty', blockDifficulty)

  import blockHashRate from "@/components/blocks/smallBlocks/hashRate"
  Vue.component('block-hash-rate', blockHashRate)

  import blockTimeSinceLastBlock from "@/components/blocks/smallBlocks/timeSinceLastBlock"
  Vue.component('block-time-since-last-block', blockTimeSinceLastBlock)


  /* Transactions Page Small Blocks: */
  import successfulTxSmallBlock from "@/components/blocks/smallBlocks/successfulTxSmallBlock"
  Vue.component('successful-tx-small-block', successfulTxSmallBlock)

  import failedTxSmallBlock from "@/components/blocks/smallBlocks/failedTxSmallBlock"
  Vue.component('failed-tx-small-block', failedTxSmallBlock)

  import pendingTxSmallBlock from "@/components/blocks/smallBlocks/pendingTxSmallBlock"
  Vue.component('pending-tx-small-block', pendingTxSmallBlock)



  /* LARGE BLOCKS ---------------------- */
  import blockLatestBlocks from "@/components/blocks/largeBlocks/latestBlocks"
  Vue.component('block-latest-blocks', blockLatestBlocks)

  import blockLastTransactions from "@/components/blocks/largeBlocks/lastTransactions"
  Vue.component('block-last-transactions', blockLastTransactions)

  import blockLastTransactions2 from "@/components/blocks/largeBlocks/lastTransactions2"
  Vue.component('block-last-transactions2', blockLastTransactions2)

  import blockAbout from "@/components/blocks/largeBlocks/about"
  Vue.component('block-about', blockAbout)

  import blockBlockDetail from "@/components/blocks/largeBlocks/blockDetail"
  Vue.component('block-block-detail', blockBlockDetail)

  import blockTokenTracker from "@/components/blocks/largeBlocks/tokenTracker"
  Vue.component('block-token-tracker', blockTokenTracker)

  import blockPendingTxs from "@/components/blocks/largeBlocks/pendingTxs"
  Vue.component('block-pending-txs', blockPendingTxs)


  /* Charts ---------------------- */
  import vueChart from "@/components/blocks/smallBlocks/charts/vuechart"
  Vue.component('vue-chart', vueChart)

  import lineChartPendingTx from "@/components/blocks/smallBlocks/charts/linechartpendingtx"
  Vue.component('line-chart-pending-tx', lineChartPendingTx)

  import barChartLastTenBlocksTx from "@/components/blocks/smallBlocks/charts/barchartlast10blockstx"
  Vue.component('bar-chart-last-ten-blocks-tx', barChartLastTenBlocksTx)

  import lineChartAveTxFees from "@/components/blocks/smallBlocks/charts/linechartavetxfees"
  Vue.component('line-chart-ave-tx-fees', lineChartAveTxFees)

  import frameCharts from "@/components/frames/charts"
  Vue.component('frame-charts', frameCharts)

  import blockLastTenBlocksTx from "@/components/blocks/smallBlocks/charts/lastTenBlocksTx"
  Vue.component('block-last-ten-blocks-tx', blockLastTenBlocksTx)

  import topMinersChart from "@/components/blocks/smallBlocks/charts/topMiners"
  Vue.component('top-miners-chart', topMinersChart)


  /*Tooltip ---------------------- */
  import tooltip from "@/components/tooltip/tooltip"
  Vue.component('tooltip', tooltip)


  /* Footer ---------------------- */
  import blockFooter from "@/components/blocks/footer/footer"
  Vue.component('block-footer', blockFooter)


   /* Generic components ---------*/
  import usageBar from "@/components/NewHome/Sections/Generic/UsageBar"
  Vue.component('usage-bar', usageBar)
  import ethAddress from "@/components/NewHome/Sections/Generic/EthAddress"
  Vue.component('eth-address', ethAddress)