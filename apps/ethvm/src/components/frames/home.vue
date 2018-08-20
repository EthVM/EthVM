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
              <li><i class="fa fa-circle success" aria-hidden="true"></i> {{ $t('footnote.success') }}</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> {{ $t('footnote.failed') }}</li>
              <li><i class="fa fa-circle pending" aria-hidden="true"></i> {{ $t('footnote.pending') }}</li>
            </ul>
          </div>
        </div>
        <div class="col-md-6">
          <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle tx-fees" aria-hidden="true"></i> {{ $t('footnote.aveTxFees') }}</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> {{ $t('footnote.aveGasPrice') }}</li>
            </ul>
          </div>
        </div>
        <!-- End 2 Top Charts -->
      </div>
      <div class="row">
        <!-- Last 20 Blocks -->
        <div class="col-md-12">
          <div class="block-title-container">
            <h3>{{ $t('title.lastBlock') }}</h3>
            <router-link to="/blocks" tag="button" class="button-common">{{ $t('bttn.viewAll') }}</router-link>
          </div>
          <div class="block-table-header latest-data-header">
            <li>{{ $t( 'tableHeader.blockN' ) }}</li>
            <li></li>
            <li>{{ $t( 'tableHeader.txs' ) }}</li>
            <li>{{ $t( 'tableHeader.reward' ) }}</li>
          </div>
          <div class="latest-data">
            <block-latest-blocks :max-items="20" :showHeader="false"></block-latest-blocks>
          </div>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> {{ $t('footnote.success') }}</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> {{ $t('footnote.failed') }}</li>
            </ul>
          </div>
          <!-- End Last 20 Blocks -->
        </div>
        <!-- Last Block Transactions -->
        <div class="col-md-12">
          <div class="block-title-container">
            <h3>{{ $t('title.lastTxs') }}</h3>
            <router-link to="/transactions" tag="button" class="button-common">{{ $t('bttn.viewAll') }}</router-link>
          </div>
          <div v-if="txs.length>0">
            <div class="block-table-header latest-data-header">
              <li>{{ $t('tableHeader.txN') }} </li>
              <li class="eth">{{ $t('common.eth') }}</li>
              <li class="limit">{{ $t( 'gas.limit' ) }}</li>
              <li class="gas">{{ $t( 'common.gwei' ) }}</li>
              <li></li>
            </div>
            <div class="latest-data">
              <block-last-transactions :transactions="txs" :showHeader="false"></block-last-transactions>
            </div>
            <div class="footnote">
              <ul>
                <li><i class="fa fa-check success" aria-hidden="true"></i> {{ $t('footnote.success') }}</li>
                <li><i class="fa fa-times failed" aria-hidden="true"></i> {{ $t('footnote.failed') }}</li>
              </ul>
            </div>
          </div>
          <div v-else class="info-common">
            <p>{{ $t('message.noTxHistory') }}</p>
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
