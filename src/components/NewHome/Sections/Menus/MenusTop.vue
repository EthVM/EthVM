<template>
  <div id="MenusTop" class="menus-top">
    
    <dir>
      <MenusSide></MenusSide>
    </dir>
    <div class="search-block">
      <input type="text" class="form-control">
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'MenusTop',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Menus/MenusTop.less";
</style>


