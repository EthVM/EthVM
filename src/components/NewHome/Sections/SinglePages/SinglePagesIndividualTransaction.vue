<template>
<div class="indivisual-tx">
  <div class="block-container"
       v-if="tx">
    <div class="tx-section-block-1">
      <div class="section-block-container">
        <p class="block-title">Individual Transaction</p>
        <table>
          <tbody>
            <tr>
              <td>Hash</td>
              <td>
                <p>{{tx.getHash().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>From</td>
              <td>
                <eth-address :address="tx.getFrom().toString()"></eth-address>
              </td>
            </tr>
            <tr v-if="tx.getContractAddress().toString()">
              <td>Contract Address</td>
              <td>
                <eth-address :address="tx.getContractAddress().toString()"></eth-address>
              </td>
            </tr>
            <tr v-if="!tx.getContractAddress().toString()">
              <td>To</td>
              <td>
                <eth-address :address="tx.getTo().toString()"></eth-address>
              </td>
            </tr>
            <tr>
              <td>Value</td>
              <td>
                <p>{{tx.getValue().toEth()}}&nbsp;ETH</p>
              </td>
            </tr>
            <tr>
              <td>Gas</td>
              <td>
                <usage-bar :value="tx.getGasUsed().toNumber()"
                           :max-value="tx.getGas().toNumber()"></usage-bar>
                <p>{{tx.getGasUsed().toNumber()}} / {{tx.getGas().toNumber()}} (Gas used / Gas Limit)</p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>Block Hash</td>
              <td>
                <p><router-link :to="'/block/'+tx.getBlockHash().toString()">{{tx.getBlockHash().toString()}}</router-link></p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>Block Number</td>
              <td>
                <p>{{tx.getBlockNumber().toNumber()}}</p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>Transaction Index</td>
              <td>
                <p>{{tx.geTransactionIndex().toNumber()}}</p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>From Account Balance</td>
              <td>
                <p>{{tx.getFromBalance().toEth()}} &nbsp;ETH</p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>To Account Balance</td>
              <td>
                <p>{{tx.getToBalance().toEth()}} &nbsp;ETH</p>
              </td>
            </tr>
            <tr v-show="!isPending">
              <td>Cumulative Gas Used</td>
              <td>
                <p>{{tx.getCumulativeGasUsed().toNumber()}}</p>
              </td>
            </tr>
            <tr>
              <td>Gas Price</td>
              <td>
                <p>{{tx.getGasPrice().toEth()}}&nbsp;ETH</p>
              </td>
            </tr>
            <tr>
              <td>Input</td>
              <td>
                <p class="input">{{tx.getInput().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>Nonce</td>
              <td>
                <p>{{tx.getNonce().toNumber()}}</p>
              </td>
            </tr>
            <tr>
              <td>V</td>
              <td>
                <p>{{tx.getV().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>R</td>
              <td>
                <p>{{tx.getR().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>S</td>
              <td>
                <p>{{tx.getS().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <p>{{tx.getStatus().toString()}}</p>
              </td>
            </tr>
            <tr>
              <td>Pending</td>
              <td>
                <p>{{tx.isPending().toString()}}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- .section-block-1 -->
  </div>
  <!-- .block-container -->
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
