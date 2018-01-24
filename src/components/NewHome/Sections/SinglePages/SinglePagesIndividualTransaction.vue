<template>
<div class="indivisual-tx">

  <div class="tx-detail-container" v-if="tx">
    <p class="block-title">Individual Transaction</p>

    <div class="tx-detail-table">
      <div class="table-row">
        <li>Hash</li>
        <li>{{tx.getHash().toString()}}</li>
      </div>
      <div class="table-row">
        <li>Timestamp</li>
        <li>{{tx.getTimestamp().toDate().toString()}} (<timeago :since="tx.getTimestamp().toDate()" :auto-update="10"></timeago>)</li>
      </div>
      <div class="table-row">
        <li>From</li>
        <li><eth-address :address="tx.getFrom().toString()"></eth-address></li>
      </div>
      <div class="table-row">
        <li>Contract Address</li>
        <li><eth-address :address="tx.getContractAddress().toString()"></eth-address></li>
      </div>
      <div class="table-row">
        <li>To</li>
        <li><eth-address :address="tx.getTo().toString()"></eth-address></li>
      </div>
      <div class="table-row">
        <li>Value</li>
        <li>{{tx.getValue().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="table-row">
        <li>Gas</li>
        <li><usage-bar :value="tx.getGasUsed().toNumber()"
                           :max-value="tx.getGas().toNumber()"></usage-bar>
                <p>{{tx.getGasUsed().toNumber()}} / {{tx.getGas().toNumber()}} (Gas used / Gas Limit)</p>
        </li>
      </div>
      <div class="table-row">
        <li>Block Hash</li>
        <li><router-link :to="'/block/'+tx.getBlockHash().toString()">{{tx.getBlockHash().toString()}}</router-link></li>
      </div>
      <div class="table-row">
        <li>Block Number</li>
        <li>{{tx.getBlockNumber().toNumber()}}</li>
      </div>
      <div class="table-row">
        <li>Transaction Index</li>
        <li>{{tx.geTransactionIndex().toNumber()}}</li>
      </div>
      <div class="table-row">
        <li>From Account Balance</li>
        <li>{{tx.getFromBalance().toEth()}} &nbsp;ETH</li>
      </div>
      <div class="table-row">
        <li>To Account Balance</li>
        <li>{{tx.getToBalance().toEth()}} &nbsp;ETH</li>
      </div>
      <div class="table-row">
        <li>Cumulative Gas Used</li>
        <li>{{tx.getCumulativeGasUsed().toNumber()}}</li>
      </div>
      <div class="table-row">
        <li>Gas Price</li>
        <li>{{tx.getGasPrice().toEth()}}&nbsp;ETH</li>
      </div>
      <div class="table-row">
        <li>Input</li>
        <li>{{tx.getInput().toString()}}</li>
      </div>
      <div class="table-row">
        <li>Nonce</li>
        <li>{{tx.getNonce().toNumber()}}</li>
      </div>
      <div class="table-row">
        <li>V</li>
        <li>{{tx.getV().toString()}}</li>
      </div>
      <div class="table-row">
        <li>R</li>
        <li>{{tx.getR().toString()}}</li>
      </div>
      <div class="table-row">
        <li>S</li>
        <li>{{tx.getS().toString()}}</li>
      </div>
      <div class="table-row">
        <li>Status</li>
        <li>{{tx.getStatus().toString()}}</li>
      </div>
      <div class="table-row">
        <li>Pending</li>
        <li>{{tx.isPending().toString()}}</li>
      </div>
            
    </div>

  </div>

</div>

</template>

<script lang="ts">
import Vue from 'vue';
import { Tx } from '@/libs';
import sEvents from '@/configs/socketEvents.json';
export default Vue.extend({
  name: 'Tx',
  props: [
    'txHash'
  ],
  data() {
    return {
      tx: null,
      isPending: false
    }
  },
  methods: {},
  beforeCreate() {},
  created() {

      /*this.$socket.emit('getAccount', '0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8', (err, result)=>{
        console.log(err, result)
      })*/
      /*this.$socket.emit('ethCall', {to:"0xd26114cd6EE289AccF82350c8d8487fedB8A0C07", data:"0x70a082310000000000000000000000007cb57b5a97eabe94205c07890be4c1ad31e486a8"}, (err, result)=>{
        console.log(err, result)
      })*/


    let _this = this
    this.$socket.emit('getTx', Buffer.from(this.txHash.substring(2), 'hex'), (_err, _tx) => {
      if (_tx) {
        _this.tx = new Tx(_tx)
        _this.isPending = _this.tx.isPending()
      }
    })

    this.$socket.emit(sEvents.join, _this.txHash)
    this.$options.sockets[_this.txHash + '_update'] = (_tx) => {
      _this.tx = new Tx(_tx)
      _this.isPending = _this.tx.isPending()
    }
  },
  beforeDestroy() {
    this.$socket.emit(sEvents.leave, this.txHash)
  }
})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/SinglePagesIndividualTransaction';
</style>
