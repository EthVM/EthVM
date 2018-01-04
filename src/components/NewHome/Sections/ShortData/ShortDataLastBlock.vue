<template>
  <div id="ShortDataLastBlock" class="last-block">

    <p class="block-title">Last Block</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='cube' scale='1'></icon></div>
      <p class="block-value">16280901</p>
    </div>
    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataLastBlock.less";
</style>
