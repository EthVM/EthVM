import Vue from 'vue'

//import * as Icon from 'vue-awesome'
//import 'vue-awesome/icons'
//Vue.component('icon', Icon)


/* SUNIL ################################################################################ */
/* SUNIL ################################################################################ */
/* SUNIL ################################################################################ */


  /* Frames ---------------------- */
  import frameHome from "@/components/sunil/frames/home"
  Vue.component('frameHome', frameHome)


  /* Header ---------------------- */
  import blockHeader from "@/components/sunil/blocks/header/header"
  Vue.component('blockHeader', blockHeader)



  /* SmallBlocks ---------------------- */
  import blockComponent from "@/components/sunil/blocks/smallBlocks/component"
  Vue.component('blockComponent', blockComponent)

  import blockLastBlock from "@/components/sunil/blocks/smallBlocks/lastBlock"
  Vue.component('blockLastBlock', blockLastBlock)

  import blockDifficulty from "@/components/sunil/blocks/smallBlocks/difficulty"
  Vue.component('blockDifficulty', blockDifficulty)

  import blockHashRate from "@/components/sunil/blocks/smallBlocks/hashRate"
  Vue.component('blockHashRate', blockHashRate)

  import blockTimeSinceLastBlock from "@/components/sunil/blocks/smallBlocks/timeSinceLastBlock"
  Vue.component('blockTimeSinceLastBlock', blockTimeSinceLastBlock)

  import blockSearch from "@/components/sunil/blocks/smallBlocks/search"
  Vue.component('blockSearch', blockSearch)



  /* LargeBlocks ---------------------- */
  import latestBlocks from "@/components/sunil/blocks/largeBlocks/latestBlocks"
  Vue.component('latestBlocks', latestBlocks)

  import lastTransactions from "@/components/sunil/blocks/largeBlocks/lastTransactions"
  Vue.component('lastTransactions', lastTransactions)



  /* Footer ---------------------- */
  import blockFooter from "@/components/sunil/blocks/footer/footer"
  Vue.component('blockFooter', blockFooter)











/* NewHome ############################################################################## */


  /* Frames ---------------------- */
  //import FrameHome from "@/components/NewHome/Frames/FrameHome"
  //Vue.component('FrameHome', FrameHome)

  import FrameAbout from "@/components/NewHome/Frames/FrameAbout"
  Vue.component('FrameAbout', FrameAbout)

  import FrameFAQ from "@/components/NewHome/Frames/FrameFAQ"
  Vue.component('FrameFAQ', FrameFAQ)

  import FrameContact from "@/components/NewHome/Frames/FrameContact"
  Vue.component('FrameContact', FrameContact)

  import FrameTransaction from "@/components/NewHome/Frames/FrameTransaction"
  Vue.component('FrameTransaction', FrameTransaction)

  import FrameBlock from "@/components/NewHome/Frames/FrameBlock"
  Vue.component('FrameBlock', FrameBlock)

  import FrameTransactions from "@/components/NewHome/Frames/FrameTransactions"
  Vue.component('FrameTransactions', FrameTransactions)

  import FrameBlocks from "@/components/NewHome/Frames/FrameBlocks"
  Vue.component('FrameBlocks', FrameBlocks)

  //import FrameIndex from "@/components/NewHome/Frames/FrameIndex"
  //Vue.component('FrameIndex', FrameIndex)

  import FrameAccount from "@/components/NewHome/Frames/FrameAccount"
  Vue.component('FrameAccount', FrameAccount)




  /* Menu ---------------------- */
  import MenusTop from "@/components/NewHome/Sections/Menus/MenusTop"
  Vue.component('MenusTop', MenusTop)

  import MenusSide from "@/components/NewHome/Sections/Menus/MenusSide"
  Vue.component('MenusSide', MenusSide)



  /* ShortData ---------------------- */
  import ShortDataLastBlock from "@/components/NewHome/Sections/ShortData/ShortDataLastBlock"
  Vue.component('ShortDataLastBlock', ShortDataLastBlock)
  
  import ShortDataTimeSinceLastBlock from "@/components/NewHome/Sections/ShortData/ShortDataTimeSinceLastBlock"
  Vue.component('ShortDataTimeSinceLastBlock', ShortDataTimeSinceLastBlock)

  import ShortDataHashRate from "@/components/NewHome/Sections/ShortData/ShortDataHashRate"
  Vue.component('ShortDataHashRate', ShortDataHashRate)

  import ShortDataDifficulty from "@/components/NewHome/Sections/ShortData/ShortDataDifficulty"
  Vue.component('ShortDataDifficulty', ShortDataDifficulty)





  /* Graphs ---------------------- */
  import VueChart from "@/components/NewHome/Sections/Graphs/VueChart"
  Vue.component('VueChart', VueChart)

  import LineChartPendingTx from "@/components/NewHome/Sections/Graphs/LineChartPendingTx"
  Vue.component('LineChartPendingTx', LineChartPendingTx)

  import BarChartLastTenBlocksTx from "@/components/NewHome/Sections/Graphs/BarChartLast10BlocksTx"
  Vue.component('BarChartLastTenBlocksTx', BarChartLastTenBlocksTx)

  import LineChartAveTxFees from "@/components/NewHome/Sections/Graphs/LineChartAveTxFees"
  Vue.component('LineChartAveTxFees', LineChartAveTxFees)




  /* Tables ---------------------- */
  import TableTransactions from "@/components/NewHome/Sections/Tables/TableTransactions"
  Vue.component('TableTransactions', TableTransactions)


  import TableTransactionsNew from "@/components/NewHome/Sections/Tables/TableTransactionsNew"
  Vue.component('TableTransactionsNew', TableTransactionsNew)


  import TablesLatestBlocks from "@/components/NewHome/Sections/Tables/TablesLatestBlocks"
  Vue.component('TablesLatestBlocks', TablesLatestBlocks)


  import TablesLatestBlocksNew from "@/components/NewHome/Sections/Tables/TablesLatestBlocksNew"
  Vue.component('TablesLatestBlocksNew', TablesLatestBlocksNew)


  import TablesTop10Senders from "@/components/NewHome/Sections/Tables/TablesTop10Senders"
  Vue.component('TablesTop10Senders', TablesTop10Senders)


  /* Footers ---------------------- */
  import FootersBottom from "@/components/NewHome/Sections/Footers/FootersBottom"
  Vue.component('FootersBottom', FootersBottom)




  /* Info  ---------------------- */
  import InfoFAQ from "@/components/NewHome/Sections/Info/InfoFAQ"
  Vue.component('InfoFAQ', InfoFAQ)
  
  import InfoAbout from "@/components/NewHome/Sections/Info/InfoAbout"
  Vue.component('InfoAbout', InfoAbout)
  
  import InfoContact from "@/components/NewHome/Sections/Info/InfoContact"
  Vue.component('InfoContact', InfoContact)




  /* SinglePages  ---------------------- */
  import SinglePagesIndividualTransaction from "@/components/NewHome/Sections/SinglePages/SinglePagesIndividualTransaction"
  Vue.component('SinglePagesIndividualTransaction', SinglePagesIndividualTransaction)
  
  import SinglePagesBlock from "@/components/NewHome/Sections/SinglePages/SinglePagesBlock"
  Vue.component('SinglePagesBlock', SinglePagesBlock)

  import LatestTransactions from "@/components/NewHome/Sections/SinglePages/LatestTransactions"
  Vue.component('LatestTransactions', LatestTransactions)

  import SmallBlockComponent from "@/components/NewHome/Sections/SmallBlockComponent"
  Vue.component('SmallBlockComponent', SmallBlockComponent)
  
  import LatestPendingTransactions from "@/components/NewHome/Sections/SinglePages/LatestPendingTransactions"
  Vue.component("LatestPendingTransactions", LatestPendingTransactions)

  import Overview from "@/components/NewHome/Sections/SinglePages/Overview"
  Vue.component("Overview", Overview)
      
  import TokenTracker from "@/components/NewHome/Sections/SinglePages/TokenTracker"
  Vue.component("TokenTracker", TokenTracker)
      


   /* Generic components ---------*/
  import UsageBar from "@/components/NewHome/Sections/Generic/UsageBar"
  Vue.component('UsageBar', UsageBar)
  import EthAddress from "@/components/NewHome/Sections/Generic/EthAddress"
  Vue.component('EthAddress', EthAddress)