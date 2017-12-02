<template>
  <div class="nav-bar">
    <div class="container">
      <div class="site-brand">
        <img class="top-logo" src="/img/logo.png">
      </div>
      <nav>
        <ul>
          <li>About</li>
          <li>Contact</li>
          <li>FAQ</li>
        </ul>
      </nav>
      <div class="nav-bar-search">
        <input class="form-control" type="search" placeholder="Search block height, address, block hash, transaction hash" id="example-search-input">
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Header'
})
</script>

<style scoped lang="less">
@import "~lessPath/frontpage.less";
</style>
