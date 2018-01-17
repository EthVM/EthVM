<template>
    <small-block-component :title="blockTitle" :value="txNumber" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataViewingLastTransactions',
    data () {
      return {
        blockTitle: 'Viewing Last Transactions',
        blockIconType: 'tachometer',
        blockIconColor: '#fba893',
        txNumber: '1000'
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataViewingLastTransactions.less";
</style>
