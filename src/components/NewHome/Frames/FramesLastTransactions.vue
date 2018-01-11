<template>
  <div class="last-transactions">



    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataAverageGasPrice></ShortDataAverageGasPrice>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataAverageValueTransfered></ShortDataAverageValueTransfered>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataViewingLastTransactions></ShortDataViewingLastTransactions>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-xs-6 block-container">
        <div class="block">
          <ShortDataTotalFees></ShortDataTotalFees>
        </div>
      </div>
    </div>


    <div class="row">
      <div class="col-md-9 block-container">
        <div class="block the-table">
         <single-pages-last-transactions v-if="type=='lasttransactions'"></single-pages-last-transactions>
         <latest-pending-transactions v-if="type=='pendingTransactions'"></latest-pending-transactions>
        </div>
      </div>  

      <div class="col-md-3 block-container">
        <div class="block">
          <TablesTop10Senders></TablesTop10Senders>
        </div>
      </div>  

    </div>


  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesContact',
    props: ['type'],
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
    @import "~lessPath/NewHome/Frames/FramesLastTransactions.less";
</style>
