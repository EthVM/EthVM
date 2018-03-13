<template>
  <div id="home">
    <div class="container">
      
      <div class="page-title-container">
        <div class="page-title">
          <h3>Blocks</h3>
          <h6 class="text-muted">Latest blocks of all time</h6>
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
        <div class="col-md-12 table-data ">
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
