<template>
  <div id="charts">
    <div class="container">
      
      <div class="page-title-container">
        <div class="page-title">
          <h3>Charts</h3>
          <h6 class="text-muted">Ethereum Charts And Stats</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>

      <!-- Section: General -->
      <div class="row">
        <div class="col-md-12">
          <div class="block-title-container-desc">
            <h3>General</h3>
            <h6>General Blockchain Information</h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Block Time</h4>
          </div>
          <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Block Size</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Total Accounts</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Total Transactions</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>

      <!-- Section: Tx history -->
      <div class="row">
        <div class="col-md-12">
          <div class="block-title-container-desc">
            <h3>Tx History</h3>
            <h6>Average sucessfull, failed, and pending transaction history</h6>
            <h6>History of transactions fees, gas price and gas limit </h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Sucessfull Tx History</h4>
          </div>
          <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Failed Tx History</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Pending Tx History</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Gas Limit History</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Tx Fees</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Gas Price</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>


      <!-- Section: Network -->
      <div class="row">
        <div class="col-md-12">
          <div class="block-title-container-desc">
            <h3>Network History</h3>
            <h6>Network usage stats</h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Hash Rate</h4>
          </div>
          <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Difficulty</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>

      <!-- Section: Network -->
      <div class="row">
        <div class="block-title-container-desc">
          <div class="col-md-12">
            <h3>Mining History</h3>
            <h6>Miners and rewards stats</h6>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Best Miner</h4>
          </div>
          <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
        </div>
        <div class="col-md-6">
          <div class="block-title-container-desc">
            <h4>Mining Rewards</h4>
          </div>
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  const MAX_ITEMS = 20
  export default Vue.extend({
    name: 'FramesCharts',
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
