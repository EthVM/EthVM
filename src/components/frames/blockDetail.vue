<template>
  <div id="block">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Block Detail</h3>
          <h6 class="text-muted">Block's Detail Information</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Page Title -->
      </div>
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <div class="block">
            <block-block-detail :block="block" :uncles="uncles"></block-block-detail>
          </div>
        </div>
        <div class="col-md-12 col-sm-12 col-xs-12" v-if="!isUncle">
          <div class="block-title-container">
            <h3>Transactions</h3>
          </div>
          <div class="block">
            <block-last-transactions :transactions="transactions" :showHeader="true"></block-last-transactions>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import store from '@/states';
import chartOptions from '@/sampleData/chartData.json';
import {
  Block,
  common,
  Tx
} from '@/libs';
export default Vue.extend({
  name: 'Block',
  props: [
    'blockHash'
  ],
  data() {
    return {
      store: store,
      options: chartOptions,
      block: null,
      common: common,
      uncles: [],
      unixtimestamp: null,
      timestamp: null,
      transactions: []
    }
  },
  methods: {},
  computed: {
    isUncle() {
      if (this.block && this.block.getIsUncle()) {
        return true
      } else {
        return false
      }
    }
  },
  mounted: function() {
    let _this = this
    this.$socket.emit('getBlock', Buffer.from(this.blockHash.substring(2), 'hex'), (err, data) => {
      if (data) {
        _this.block = new Block(data)

        let uncleHashes = _this.block.getUncleHashes()
        _this.$socket.emit('getBlockTransactions', _this.block.getHash().toBuffer(), (err, data) => {
          _this.transactions = data.map((_tx) => {
            return new Tx(_tx)
          })
        })
        uncleHashes.forEach((_hash: any, idx: number) => {
          _this.$socket.emit('getBlock', _hash.toBuffer(), (err, data) => {
            _this.uncles.push(new Block(data))
          })
        })
      }
    })
  }
})
</script>
<style scoped lang="less">
@import "~lessPath/sunil/frames/blockDetail.less";
</style>
