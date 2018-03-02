<template>
  <div id="home">
    <div class="container">
      
      <div class="page-title-container">
        <div class="page-title">
          <h3>Home</h3>
          <h6 class="text-muted">Welcome to Ethereum Virtual Machine</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>

      <div class="row small-blocks">
        <div class="col-md-3"><block-last-block></block-last-block></div>
        <div class="col-md-3"><block-time-since-last-block></block-time-since-last-block></div>
        <div class="col-md-3"><block-hash-rate></block-hash-rate></div>
        <div class="col-md-3"><block-difficulty></block-difficulty></div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h3>TX summary</h3>
            <h6 class="text-muted">Number of successful, failed, and pending transactions that have occured in the last 10 blocks.</h6>
          </div>
          <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> Failed</li>
              <li><i class="fa fa-circle pending" aria-hidden="true"></i> Pending</li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h3>Average Tx Costs</h3>
            <h6>Average transaction fees and average gas price in the last 10 blocks.</h6>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle tx-fees" aria-hidden="true"></i> avg Tx Fees (ETH)</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> avg Gas Price (GWEI)</li>
            </ul>
          </div>
        </div>  
      </div>
      <div class="row">
        <div class="col-md-12 table-data">
          <div class="block-title-container">
            <h3>Latest Blocks</h3>
            <button>View All</button>
          </div>
          <div class="latest-blocks-header">
            <li>Block#</li>
            <li></li>
            <li>TXs</li>
            <li>Reward</li>
          </div>
          
          <div class="latest-blocks-data">
            <block-latest-blocks :max-items="20"></block-latest-blocks>
          </div>

          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> Failed</li>
            </ul>
          </div>
        </div>
        <div class="col-md-12 table-data">
          <div class="block-title-container">
            <h3>Last Transactions</h3>
            <button>View All</button>
          </div>
          <div class="last-transactions-header">
            <li>TXn#</li>
            <li class="eth">ETH</li>
            <li class="gas">GAS</li>
            <li>WEI</li>
            <li></li>
          </div>
          
          <div class="last-transactions-data">
            <block-last-transactions :transactions="txs"></block-last-transactions>
          </div>

          <div class="footnote">
            <ul>
              <li><i class="fa fa-check success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-times failed" aria-hidden="true"></i> Failed</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  const MAX_ITEMS = 20
  export default Vue.extend({
    name: 'FramesHome',
    data () {
      return {}
    },
    created (){},
    computed:{
      txs(){
          if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
          else return []
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/frames/home.less";
</style>
