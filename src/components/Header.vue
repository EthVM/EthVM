<template>
  <div class="nav-bar">
    <div class="container">
      <div class="site-brand">
        <img class="top-logo" src="/img/logo.png">
      </div>


      <div v-on:click="toggleSearch();" class="search-button">
        <icon class="mobile-search-open" name='search' scale='1.7'></icon>
      </div>

      <topnav></topnav>


      <div ref="topSearchInput" class="nav-bar-search">
        <input class="form-control" type="search" placeholder="Search block height, address, block hash, transaction hash" id="example-search-input">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Header',
  methods: {
    toggleSearch: function () {
      this.$refs.topSearchInput.classList.toggle('nav-bar-search-show')
    }
  }
})
</script>

<style scoped lang="less">
@import "~lessPath/frontpage.less";
</style>
