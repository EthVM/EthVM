<template>
  <div id="ShortDataTimeSinceLastBlock" class="time-since-last-block">

    <p>Time Since Last Block</p>
    <p class="block-value">20 Sec</p>

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
