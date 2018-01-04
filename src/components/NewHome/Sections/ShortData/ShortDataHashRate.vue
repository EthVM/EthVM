<template>
  <div id="ShortDataHashRate" class="hash-rate">

    <p class="block-title">Hasg Rate</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='hashtag' scale='1'></icon></div>
      <p class="block-value">11,345,345 THs</p>
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
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataHashRate.less";
</style>
