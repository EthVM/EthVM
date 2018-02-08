<template>
  <div id="menu-top">
    <div class="container menu-container">
      <div class="logo">
        <router-link to="/"><img src="~@/assets/logo.png"></router-link>
      </div>
      <nav class="main-menu">
        <ul>
          <li class="selected"><a href="/"><div class="icon"></div><span>Home</span></a></li>
          <li><a href=""><div class="icon"></div><span>Blocks</span></a></li>
          <li><a href=""><div class="icon"></div><span>Charts</span></a></li>
          <li><a href=""><div class="icon"></div><span>Transactions</span></a></li>
          <li><a href=""><div class="icon"></div><span>Pending Transactions</span></a></li>
          <li><a href=""><div class="icon"></div><span>About</span></a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    data () {
      return {        
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/header/header.less";
</style>