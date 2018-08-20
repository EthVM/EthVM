<template>
  <div>
    <div class="container">
      <div class="page-title-container">
        <div class="page-title">
          <h3>{{ $t('title.about') }}</h3>
          <h6 class="text-muted">{{ $t('subTitle.about') }}</h6>
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
  computed: {
    txs() {
      if (this.$store.getters.getTxs.length) {
        return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      }
      else {
        return []
      }
    }
  }
})
</script>

<style scoped lang="less">
//@import "~lessPath/sunil/frames/about.less";
</style>
