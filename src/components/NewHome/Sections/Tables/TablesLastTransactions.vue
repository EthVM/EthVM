<template>
  <div id="TablesLastTransactions" class="last-transactions">

    <p class="block-title">Last Transactions</p>

    <div class="table-container">
      <table class="table-header">
        <thead>
          <tr>
            <td>Status</td>
            <td>From</td>
            <td>Amount</td>
            <td>To</td>
          </tr>
        </thead>
      </table>

      <!-- MAIN LOOP START ########################################## -->
      <div class="table-content" v-for="tx in transactions" v-bind:key="tx.getHash().toString()">
        <table class="top-table-content">
          <tbody>
            <tr>
              <td><p v-if="!tx.getStatus()"><span>Fail</span></p><p v-if="tx.getStatus()"><span>Success</span></p></td>
              <td class="top-hash"><p><span>{{tx.getFrom().toString()}}</span></p></td>
              <td class="top-miner"><p><span>{{tx.getValue().toEth()}}</span>&nbsp;ETH</p></td>
              <td class="top-hash"><p><span>{{tx.getTo().toString()}}</span></p></td>
            </tr>
          </tbody>
        </table>
        
        <table class="mid-table-content">
          <tbody>
            <tr>
              <td class="mid-hash-value"><icon name='hashtag' scale='1'></icon>&nbsp;<p><a :href="'/tx/'+tx.getHash().toString()">{{tx.getHash().toString()}}</a></p></td>
              <td><icon name='tint' scale='1'></icon>&nbsp;<p>{{tx.getGasUsed().toNumber()}}&nbsp;Gas</p></td>
              <td><icon name='database' scale='1'></icon>&nbsp;<p>{{tx.getGasPrice().toGWei()}}&nbsp;GWEI</p></td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- MAIN LOOP END ########################################## -->

    </div>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import { FIFO, Tx, processTxs } from '@/libs'
import globConfigs from '@/configs/global.json'
import sEvents from '@/configs/socketEvents.json'
import Visibility from 'visibilityjs'
export default Vue.extend({
  name: 'TablesLastTransactions',
  props: {
    maxItems: Number
  },
  data () {
    return {
      txs: new FIFO< Tx >(globConfigs.maxTxsInMemory, processTxs)
    }
  },
  beforeMount () {
    let _this = this
    _this.$socket.emit(sEvents.pastTxs, '', (_txs) => {
      _txs.forEach((_tx) => {
        _this.txs.add(new Tx(_tx))
      })
    })
  },
  created () {
    let _this = this
    _this.$eventHub.$on(sEvents.newTx, (_tx) => {
      if (Visibility.state() === 'visible') {
        _this.txs.add(_tx)
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newTx)
  },
  computed: {
    transactions () {
      return this.txs.items().slice(0, this.maxItems)
    }
  }
})
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TablesLastTransactions.less";
</style>
