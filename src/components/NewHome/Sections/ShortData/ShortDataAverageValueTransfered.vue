<template>
  <div class="average-value-transfered">

    <p class="block-title">Average Value Transfered</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='tachometer' scale='1'></icon></div>
      <p class="block-value">2.17 H</p>
    </div>
    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataAverageValueTransfered',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataAverageValueTransfered.less";
</style>
