import Vue from 'vue'

  /* Frames ---------------------- */
  import frameHome from "@/components/sunil/frames/home"
  Vue.component('frame-home', frameHome)

  import frameBlocks from "@/components/sunil/frames/blocks"
  Vue.component('frame-blocks', frameBlocks)

  import frameTxs from "@/components/sunil/frames/transactions"
  Vue.component('frame-txs', frameTxs)

  import frameAbout from "@/components/sunil/frames/about"
  Vue.component('frame-about', frameAbout)

  import frameBlockDetail from "@/components/sunil/frames/blockDetail"
  Vue.component('frame-block-detail', frameBlockDetail)

  import frameAccount from "@/components/sunil/frames/account"
  Vue.component('frame-account', frameAccount)

  import framePending from "@/components/sunil/frames/pendingTxs"
  Vue.component('frame-pending', framePending)



  /* Header ---------------------- */
  import blockHeader from "@/components/sunil/blocks/header/header"
  Vue.component('block-header', blockHeader)



  /* Modal ---------------------- */
  import blockModal from "@/components/sunil/blocks/modal/modal"
  Vue.component('block-modal', blockModal)



  /* SMALL BLOCKS ---------------------- */

  /* Parent Small Block Component: */
  import blockComponent from "@/components/sunil/blocks/smallBlocks/component"
  Vue.component('block-component', blockComponent)


  /* Search Block: */
  import blockSearch from "@/components/sunil/blocks/smallBlocks/search"
  Vue.component('block-search', blockSearch)


  /* Home Page Small Blocks: */
  import blockLastBlock from "@/components/sunil/blocks/smallBlocks/lastBlock"
  Vue.component('block-last-block', blockLastBlock)

  import blockDifficulty from "@/components/sunil/blocks/smallBlocks/difficulty"
  Vue.component('block-difficulty', blockDifficulty)

  import blockHashRate from "@/components/sunil/blocks/smallBlocks/hashRate"
  Vue.component('block-hash-rate', blockHashRate)

  import blockTimeSinceLastBlock from "@/components/sunil/blocks/smallBlocks/timeSinceLastBlock"
  Vue.component('block-time-since-last-block', blockTimeSinceLastBlock)


  /* Transactions Page Small Blocks: */
  import successfulTxSmallBlock from "@/components/sunil/blocks/smallBlocks/successfulTxSmallBlock"
  Vue.component('successful-tx-small-block', successfulTxSmallBlock)

  import failedTxSmallBlock from "@/components/sunil/blocks/smallBlocks/failedTxSmallBlock"
  Vue.component('failed-tx-small-block', failedTxSmallBlock)

  import pendingTxSmallBlock from "@/components/sunil/blocks/smallBlocks/pendingTxSmallBlock"
  Vue.component('pending-tx-small-block', pendingTxSmallBlock)



  /* LARGE BLOCKS ---------------------- */
  import blockLatestBlocks from "@/components/sunil/blocks/largeBlocks/latestBlocks"
  Vue.component('block-latest-blocks', blockLatestBlocks)

  import blockLastTransactions from "@/components/sunil/blocks/largeBlocks/lastTransactions"
  Vue.component('block-last-transactions', blockLastTransactions)

  import blockLastTransactions2 from "@/components/sunil/blocks/largeBlocks/lastTransactions2"
  Vue.component('block-last-transactions2', blockLastTransactions2)

  import blockAbout from "@/components/sunil/blocks/largeBlocks/about"
  Vue.component('block-about', blockAbout)

  import blockBlockDetail from "@/components/sunil/blocks/largeBlocks/blockDetail"
  Vue.component('block-block-detail', blockBlockDetail)

  import blockTokenTracker from "@/components/sunil/blocks/largeBlocks/tokenTracker"
  Vue.component('block-token-tracker', blockTokenTracker)

  import blockPendingTxs from "@/components/sunil/blocks/largeBlocks/pendingTxs"
  Vue.component('block-pending-txs', blockPendingTxs)


  /* Charts ---------------------- */
  import vueChart from "@/components/sunil/blocks/smallBlocks/charts/vuechart"
  Vue.component('vue-chart', vueChart)

  import lineChartPendingTx from "@/components/sunil/blocks/smallBlocks/charts/linechartpendingtx"
  Vue.component('line-chart-pending-tx', lineChartPendingTx)

  import barChartLastTenBlocksTx from "@/components/sunil/blocks/smallBlocks/charts/barchartlast10blockstx"
  Vue.component('bar-chart-last-ten-blocks-tx', barChartLastTenBlocksTx)

  import lineChartAveTxFees from "@/components/sunil/blocks/smallBlocks/charts/linechartavetxfees"
  Vue.component('line-chart-ave-tx-fees', lineChartAveTxFees)

  import frameCharts from "@/components/sunil/frames/charts"
  Vue.component('frame-charts', frameCharts)

  import blockLastTenBlocksTx from "@/components/sunil/blocks/smallBlocks/charts/lastTenBlocksTx"
  Vue.component('block-last-ten-blocks-tx', blockLastTenBlocksTx)

  import topMinersChart from "@/components/sunil/blocks/smallBlocks/charts/topMiners"
  Vue.component('top-miners-chart', topMinersChart)


  /*Tooltip ---------------------- */
  import tooltip from "@/components/sunil/tooltip/tooltip"
  Vue.component('tooltip', tooltip)


  /* Footer ---------------------- */
  import blockFooter from "@/components/sunil/blocks/footer/footer"
  Vue.component('block-footer', blockFooter)


   /* Generic components ---------*/
  import usageBar from "@/components/NewHome/Sections/Generic/UsageBar"
  Vue.component('usage-bar', usageBar)
  import ethAddress from "@/components/NewHome/Sections/Generic/EthAddress"
  Vue.component('eth-address', ethAddress)