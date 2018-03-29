<template>
  <div id="tx-detail">
    <div class="container">
      
      <div class="page-title-container">
        <div class="page-title">
          <h3>Transaction Details</h3>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>

      
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <div class="block-title-container">
            <h3 class="hidden">Tx Information</h3>
          </div>
          <div class="block">
            <block-tx-detail :tx="transaction" ></block-tx-detail>
          </div>
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
</template>


<script lang="ts">
import Vue from 'vue';
import store from '@/states';
import chartOptions from '@/sampleData/chartData.json';
import { Block, common, Tx } from '@/libs';
export default Vue.extend({
  name: 'tx-Detail',
  props: [
    'txHash'
  ],
  data() {
    return {
      store: store,
      transaction: null,
      common: common,
      uncles: [],
      unixtimestamp: null,
      timestamp: null,
      transactions: []
    }
  },
  methods: {},
  computed: {
  },
  mounted: function() {
    let _this = this
    this.$socket.emit('getTx', Buffer.from(this.txHash.substring(2), 'hex'), (err, data) => {
      if (data) {
        _this.transaction = new Tx(data)

        /* Method to get Subtransactions: */
        /*let uncleHashes = _this.block.getUncleHashes()
        _this.$socket.emit('getBlockTransactions', _this.block.getHash().toBuffer(), (err, data) => {
          _this.transactions = data.map((_tx) => {
            return new Tx(_tx)
          })
        })
        uncleHashes.forEach((_hash: any, idx: number) => {
          _this.$socket.emit('getBlock', _hash.toBuffer(), (err, data) => {
            _this.uncles.push(new Block(data))
          })
        }) */
      }
    })

  }

})

</script>

<style scoped lang="less">
  @import "~lessPath/sunil/frames/blockDetail.less";
</style>
