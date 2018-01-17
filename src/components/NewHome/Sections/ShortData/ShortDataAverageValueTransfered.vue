<template>
    <small-block-component :title="blockTitle" :value="averageValueTransfered" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataAverageValueTransfered',
    data () {
      return {
      blockTitle: 'Average Value Transfered',
      blockIconType: 'tachometer',
      blockIconColor: '#ffd800',
      averageValueTransfered: '2.17'
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataAverageValueTransfered.less";
</style>
