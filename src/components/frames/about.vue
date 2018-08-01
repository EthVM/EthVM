<template>
  <div>
    <div class="container">

      <div class="page-title-container">
        <div class="page-title">
          <h3>About</h3>
          <h6 class="text-muted">Welcome to Ethereum Virtual Machine</h6>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>

      <block-about></block-about>

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
      if (this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      else return []
    }
  }
})
</script>

<style scoped lang="less">
//@import "~lessPath/sunil/frames/about.less";
</style>
