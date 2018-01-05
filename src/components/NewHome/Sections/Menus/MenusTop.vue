<template>
  <div id="MenusTop" class="menus-top">
    <div class="top-block">
      <div class="logo-block">
        <a href="/"><img src="/img/logo.png"></a>
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
      <MenusSide></MenusSide>
    </div>



  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'MenusTop',
    data () {
      return {
        menuShow: false
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Menus/MenusTop.less";
</style>


