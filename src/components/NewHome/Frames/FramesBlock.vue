<template>
  <div class="block last-transactions">
    <div class="row">
      <div class="col-md-6 col-sm-12 col-xs-12 block-container">
        <div class="block">
          <SinglePagesBlock :block="block" :uncles="uncles" :notuncle="NotUncle"></SinglePagesBlock>
        </div>
      </div>
      <div class="col-md-6 col-sm-12 col-xs-12 block-container" v-if="NotUncle">
        <div class="block">
          <table-transactions-new :transactions="transactions"></table-transactions-new>
        </div>
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
  computed:{
    NotUncle(){
      if(this.block && !this.block.getIsUncle()){
        return true;
      }
      else{
        return false;
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
  @import "~lessPath/NewHome/Frames/FramesLastTransactions.less";
</style>
