<template>
  <small-block-component :title="blockTitle" :value="averageGasPrice" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataAverageGasPrice',
    data () {
      return {
      blockTitle: 'Average Gas Price',
      blockIconType: 'tachometer',
      blockIconColor: '#c271f5',
      averageGasPrice: ' 0.0004'
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataAverageGasPrice.less";
</style>
