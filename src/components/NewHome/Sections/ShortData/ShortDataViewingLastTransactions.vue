<template>
  <div class="viewing-last-transactions">

    <p class="block-title">Viewing Last Transactions</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='tachometer' scale='1'></icon></div>
      <p class="block-value">2.17 H</p>
    </div>
    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataViewingLastTransactions',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataViewingLastTransactions.less";
</style>
