<template>
  <div id="block">
    <div class="container">
      <!-- Page Title -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>{{ $t('title.blockDetail') }}</h3>
          <h6 class="text-muted">{{ $t('subTitle.blockDetail') }}</h6>
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
            <h3>{{ $t('title.blockTx') }}</h3>
          </div>
          <div v-if="transactions.length > 0" class="block">
            <block-last-transactions :transactions="transactions" :showHeader="true"></block-last-transactions>
          </div>
          <div v-else class="info-common">
            <p>{{ $t( 'message.noTxInBlock' ) }} </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Block, common, Tx } from '@app/libs'
import chartOptions from '@app/sampleData/chartData.json'
import sEvents from '@app/configs/socketEvents.json'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'Block',
  props: ['blockHash'],
  data() {
    return {
      common,
      store,
      options: chartOptions,
      block: null,
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
      }
      return false
    }
  },
  mounted() {
    /* Get Block Data: */
    this.$socket.emit(sEvents.getBlock, { hash: Buffer.from(this.blockHash.substring(2), 'hex') }, (error, result) => {
      if (result) {
        this.block = new Block(result)
        const uncleHashes = this.block.getUncleHashes()
        /*Get Transactions for the block: */
        this.$socket.emit(sEvents.getBlockTransactions, { hash: this.block.getHash().toBuffer() }, (err, data) => {
          this.transactions = data.map(_tx => {
            return new Tx(_tx)
          })
        })
        uncleHashes.forEach((_hash: any, idx: number) => {
          this.$socket.emit(sEvents.getBlock, { hash: _hash.toBuffer() }, (err, data) => {
            this.uncles.push(new Block(data))
          })
        })
      }
    })
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
