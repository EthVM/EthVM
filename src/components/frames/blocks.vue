<template>
  <div id="blocks-frame">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Blocks</h3>
          <h6 class="text-muted">Blocks, most recent first</h6>
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
      <!-- Blocks Table -->
      <div class="row">
        <div class="col-md-12">
          <block-latest-blocks :max-items="20" v-bind:showHeader="true"></block-latest-blocks>
          <div class="footnote">
            <ul>
              <li><i class="fa fa-circle success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-circle failed" aria-hidden="true"></i> Failed</li>
            </ul>
          </div>
        </div>
      <!-- EndBlocks Table -->
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
@import '~lessPath/sunil/global';
</style>
