<template>
<div class="last-transactions">
  <div class="row">
    <div class="col-md-3 col-sm-3 col-xs-6 block-container">
      <div class="block">
        <small-block-component title='Average Gas Price (GWEI)'
                               :value="overview.avgGasPrice"
                               icon-name='tachometer'
                               icon-color='#c271f5'></small-block-component>
      </div>
    </div>
    <div class="col-md-3 col-sm-3 col-xs-6 block-container">
      <div class="block">
        <small-block-component title='Average Value Transfered (ETH)'
                               :value="overview.avgValue"
                               icon-name='tachometer'
                               icon-color='#ffd800'></small-block-component>
      </div>
    </div>
    <div class="col-md-3 col-sm-3 col-xs-6 block-container">
      <div class="block">
        <small-block-component title='Viewing Last Transactions'
                               :value="overview.totalValues"
                               icon-name='tachometer'
                               icon-color='#fba893'></small-block-component>
      </div>
    </div>
    <div class="col-md-3 col-sm-3 col-xs-6 block-container">
      <div class="block">
        <small-block-component title='Total Fees (ETH)'
                               :value="overview.totalFees"
                               icon-name='tachometer'
                               icon-color='#6bee69'></small-block-component>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-md-6 block-container">
      <div class="block the-table">
        <latest-transactions v-if="type=='transactions'"
                             @updated="overviewReceived"></latest-transactions>
        <latest-pending-transactions v-if="type=='pendingTransactions'" @updated="overviewReceived"></latest-pending-transactions>
      </div>
    </div>
    <div class="col-md-6 block-container">
      <div class="block">
        <TablesTop10Senders :senders="overview.senders"></TablesTop10Senders>
      </div>
    </div>
  </div>
</div>

</template>

<script lang="ts">
import Vue from 'vue';
import ethUnits from 'ethereumjs-units'
import bn from 'bignumber.js'
export default Vue.extend({
  name: 'FramesContact',
  props: [
    'type'
  ],
  data() {
    return {
      overview: {
        avgGasPrice: 0,
        avgValue: 0,
        totalValues: 0,
        totalFees: 0,
        senders: []
      }
    }
  },
  methods: {
    overviewReceived(valObj) {
      this.overview.avgGasPrice = new bn(ethUnits.convert(valObj.totalGasPrice.div(valObj.length).toFixed(),'wei', 'gwei')).round(2).toString()
      this.overview.avgValue = new bn(ethUnits.convert(valObj.totalValue.div(valObj.length).toFixed(),'wei','eth')).round(2).toString()
      this.overview.totalValues = valObj.length
      this.overview.totalFees = new bn(ethUnits.convert(valObj.totalFees.toFixed(),'wei','eth')).round(2).toString()
      this.overview.senders = valObj.topSenders
    }
  }
})

</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Frames/FramesLastTransactions.less";
</style>
