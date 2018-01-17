<template>
  <small-block-component :title="blockTitle" :value="totalFees" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataTotalFees',
    data () {
      return {
        blockTitle: 'Total Fees',
        blockIconType: 'tachometer',
        blockIconColor: '#6bee69',
        totalFees: '100.00'
      }
    }
  })
</script>

<style scoped lang="less">
  @import '~lessPath/NewHome/globalVars.less';
</style>
