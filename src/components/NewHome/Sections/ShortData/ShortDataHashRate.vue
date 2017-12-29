<template>
  <div id="ShortDataHashRate" class="hash-rate">

    <p>Hasg Rate</p>
    <p class="block-value">11,345,345 THs</p>

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
