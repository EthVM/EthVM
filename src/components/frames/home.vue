<template>
  <div id="home">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>{{ $t('title.home') }}</h3>
          <h6 class="text-muted">{{ $t('subTitle.home') }}</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Page Title -->
      </div>
      <!-- 4 Top Blocks -->
      <div class="small-blocks-row">
        <block-last-block></block-last-block>
        <block-time-since-last-block></block-time-since-last-block>
        <block-hash-rate></block-hash-rate>
        <block-difficulty></block-difficulty>
        <!-- End 4 Top Blocks -->
      </div>
      <!-- 2 Top Charts -->
      <div class="row">
        <div class="col-md-6">
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
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle tx-fees" aria-hidden="true"></i> avg Tx Fees (ETH)</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> avg Gas Price (GWEI)</li>
            </ul>
          </div>
        </div>
        <!-- End 2 Top Charts -->
      </div>
      <div class="row">
        <!-- Last 20 Blocks -->
        <div class="col-md-12">
          <div class="block-title-container">
            <h3>Last Blocks</h3>
            <router-link to="/blocks" tag="button" class="button-common">View All</router-link>
          </div>
          <div class="block-table-header latest-data-header">
            <li>Block #</li>
            <li></li>
            <li>Txs</li>
            <li>Reward</li>
          </div>
          <div class="latest-data">
            <block-latest-blocks :max-items="20"></block-latest-blocks>
          </div>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> Failed</li>
            </ul>
          </div>
          <!-- End Last 20 Blocks -->
        </div>
        <!-- Last Block Transactions -->
        <div class="col-md-12">
          <div class="block-title-container">
            <h3>Last Transactions</h3>
            <router-link to="/transactions" tag="button" class="button-common">View All</router-link>
          </div>
          <div v-if="txs.length>0">
            <div class="latest-data">
              <block-last-transactions :transactions="txs" :showHeader="true"></block-last-transactions>
            </div>
            <div class="footnote">
              <ul>
                <li><i class="fa fa-check success" aria-hidden="true"></i> Success</li>
                <li><i class="fa fa-times failed" aria-hidden="true"></i> Failed</li>
              </ul>
            </div>
          </div>
          <div v-else class="info-common">
            <p> There Is No Transactions History </p>
          </div>

          <!-- End Last Block Transactions -->
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
    data() {
      return {}
    },
    computed: {
      txs() {
        if (this.$store.getters.getTxs.length) {
          return this.$store.getters.getTxs.slice(0, MAX_ITEMS)

        } else {
          return []
        }
      }
    }
  })
</script>

<style scoped lang="less">
  @import '~lessPath/sunil/frames/home.less';
</style>
