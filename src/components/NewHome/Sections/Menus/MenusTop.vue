<template>
  <div id="MenusTop" class="menus-top">
    <div class="top-block">
      <div class="logo-block">
        <router-link to="/"><img src="~@/static/img/logo.png"></router-link>
      </div>

      <div class="search-container">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Type to search hash, miner, from" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>
      </div>

      <div class="menu-icon-container">
        <div class="show-icon-block" v-if="menuShow == false" v-on:click="menuShow = true">
          <icon name='bars' scale='1'></icon>
        </div>
        <div class="hide-icon-block" v-if="menuShow" v-on:click="menuShow = false">
          <icon name='times' scale='1'></icon>
        </div>
      </div>
    </div>
    
    <div v-if="menuShow" class="menu-side">
      
      <div class="mobile-search-container">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Type to search hash, miner, from" aria-label="Recipient's username" aria-describedby="basic-addon2">
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button">Search</button>
          </div>
        </div>
      </div>

      <MenusSide v-on:mobileMenuClicked="hideMobileMenu"></MenusSide>
    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'MenusTop',
    data () {
      return {
        menuShow: false,
        mobileClicked: false
      }
    },
    methods: {
      hideMobileMenu: function () {
        this.menuShow = false
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Menus/MenusTop.less";
</style>


