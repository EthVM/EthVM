<template>
  <div id="tx-frame">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Transactions</h3>
          <h6 class="text-muted">Transactions, most recent first</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Page Title -->
      </div>
      <!-- 4 Top Blocks -->
      <div class="small-blocks-row">
        <block-last-block></block-last-block>
        <successful-tx-small-block></successful-tx-small-block>
        <failed-tx-small-block></failed-tx-small-block>
        <pending-tx-small-block></pending-tx-small-block>
        <!-- End 4 Top Blocks -->
      </div>
      <!-- Tx Table -->
      <div class="row">
        <div class="col-md-12">
          <block-last-transactions :transactions="txs" :showHeader="true"></block-last-transactions>
        </div>
        <div class="col-md-12 footnote">
          <ul>
            <li><i class="fa fa-check success" aria-hidden="true"></i> Success</li>
            <li><i class="fa fa-times failed" aria-hidden="true"></i> Failed</li>
          </ul>
        </div>
        <!-- End Tx Table -->
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
  created() {},
  computed: {
    txs(): any[] {
      if (this.$store.getters.getTxs.length) {
        return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      }
      return []
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
