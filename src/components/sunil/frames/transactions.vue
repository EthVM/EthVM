<template>
  <div id="home">
    <div class="container">
      
      <div class="page-title-container">
        <div class="page-title">
          <h3>Last Transactions</h3>
          <h6 class="text-muted">Latest blocks of all time</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>


      <div class="row">
        <div class="col-md-3"><block-avg-gas-price></block-avg-gas-price></div>
        <div class="col-md-3"><block-avg-value-transfered></block-avg-value-transfered></div>
        <div class="col-md-3"><block-view-last-transactions></block-view-last-transactions></div>
        <div class="col-md-3"><block-total-fees></block-total-fees></div>
      </div>

      <div class="row">
        <div class="col-md-12 table-data ">
          <div class="block-title-container">
            <h3>Transactions</h3>
            
          </div>
          <div class="latest-blocks-header">
            <li>Block#</li>
            <li></li>
            <li>TXs</li>
            <li>Reward</li>
          </div>
          
          <div class="latest-blocks-data">
            <block-last-transactions :transactions="txs"></block-last-transactions>
          </div>

          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> Failed</li>
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
  @import "~lessPath/sunil/frames/blocks.less";
</style>
