<template>
  <div id="menu-top" class="navbar navbar-default navbar-fixed-top">
    <div class="container menu-container">
      <div class="logo">
        <router-link to="/"><img src="~@/assets/logo.png"></router-link>
      </div>
      <nav class="main-menu">
        <ul>
          <li v-bind:class="{ 'selected' : pagename == undefined }"><a href="/"><div class="icon"></div><span>Home</span></a></li>
          <li v-bind:class="{ 'selected' : pagename == 'blocks' }"><a href="/blocks"><div class="icon"></div><span>Blocks</span></a></li>
          <li v-bind:class="{ 'selected' : pagename == 'charts' }"><a href="/charts"><div class="icon"></div><span>Charts</span></a></li>
          <li v-bind:class="{ 'selected' : pagename == 'transactions' }"><a href="/transactions"><div class="icon"></div><span>Transactions</span></a></li>
          <li v-bind:class="{ 'selected' : pagename == 'pending' }"><a href="/pending"><div class="icon"></div><span>Pending Transactions</span></a></li>
          <li v-bind:class="{ 'selected' : pagename == 'about' }"><a href="/about"><div class="icon"></div><span>About</span></a></li>
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
    },
    props: ['pagename'],
    mounted: function() {
      console.log(this.pagename)
    }
  })

</script>

<style scoped lang="less">
  @import "~lessPath/sunil/blocks/header/header.less";
</style>