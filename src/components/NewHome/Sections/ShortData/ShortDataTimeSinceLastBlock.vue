<template>
  <div id="ShortDataTimeSinceLastBlock" class="time-since-last-block">

    <p class="block-title">Time Since Last Block</p>

    <div class="bottom-block">
      <div class="icon-block"><icon name='clock-o' scale='1'></icon></div>
      <p class="block-value">20 Sec</p>
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
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataTimeSinceLastBlock.less";
</style>
