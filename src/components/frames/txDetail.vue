<template>
  <div id="tx-detail">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Transaction Info </h3>
          <h6 class="text-muted">Ethereum transaction overview</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Page Title -->
      </div>
      <!-- Tx Details -->
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <block-tx-detail :tx="transaction"></block-tx-detail>
        </div>
        <!-- End Tx Details -->
      </div>
      <!-- Fix this - get sub tx
        <div class="col-md-12 col-sm-12 col-xs-12" >
          <div class="block-title-container">
            <h3>Sub Transactions</h3>
          </div>
          <div class="block">
            <block-last-transactions :tx="transactions"></block-last-transactions>
          </div>
        </div>
      -->
    </div>
  </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
import chartOptions from '@/sampleData/chartData.json'
import { Block, common, Tx } from '@/libs'

export default Vue.extend({
  name: 'tx-Detail',
  props: ['txHash'],
  data() {
    return {
      store: store,
      transaction: null,
      common: common,
      unixtimestamp: null,
      timestamp: null
    }
  },
  methods: {},
  computed: {},
  mounted: function() {
    /* Get Tx Info */
    let _this = this
    this.$socket.emit('getTx', Buffer.from(this.txHash.substring(2), 'hex'), (err, data) => {
      if (data) {
        _this.transaction = new Tx(data)
        /* Method to get Subtransactions: */
      }
    })
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
