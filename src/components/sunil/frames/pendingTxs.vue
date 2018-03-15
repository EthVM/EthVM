<template>

  <div>
    <div class="container">




      <div class="page-title-container">
        <div class="page-title">
          <h3>Transactions</h3>
          <h6 class="text-muted">Last transactions of all time</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>




      <div class="row">
        <div class="col-md-12 table-data">

          <div class="last-transactions-header">
            <li>TXn#</li>
            <li class="eth">ETH</li>
            <li class="gas">GAS</li>
            <li>WEI</li>
            <li></li>
          </div>
          
          <div class="last-transactions-data">
            <block-pending-txs :transactions="pendingTxs"></block-pending-txs>
          </div>

          <div class="footnote">
            <ul>
              <li><i class="fa fa-check success" aria-hidden="true"></i> Success</li>
              <li><i class="fa fa-times failed" aria-hidden="true"></i> Failed</li>
            </ul>
          </div>
        </div>
      </div>

    </div><!-- .container -->
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import { Tx } from '@/libs'
import Visibility from 'visibilityjs'
import bn from 'bignumber.js';
let getOverview = (arr: Array<Tx>) => {
  let overview = {
    totalGasPrice: new bn(0),
    totalValue: new bn(0),
    length: 0,
    totalFees: new bn(0),
    topSenders: []
  }
  let senders = {}
  arr.forEach((_tx: Tx) => {
    overview.totalGasPrice = overview.totalGasPrice.add(_tx.getGasPrice().toWei())
    overview.totalValue = overview.totalValue.add(_tx.getValue().toWei())
    overview.totalFees = overview.totalFees.add(new bn(_tx.getGasPrice().toWei()).mul(_tx.getGasUsed().toNumber()))
    if (senders[_tx.getFrom().toString()]) {
      senders[_tx.getFrom().toString()] = senders[_tx.getFrom().toString()].add(_tx.getValue().toWei())
    } else {
      senders[_tx.getFrom().toString()] = new bn(_tx.getValue().toWei())
    }
  })
  let tempArr = []
  for (var add in senders) {
    if (senders.hasOwnProperty(add)) {
      tempArr.push({
        address: add,
        value: senders[add]
      })
    }
  }
  tempArr.sort(function(a, b) {
    if (a.value.gt(b.value)) return -1
    else return 1
  })
  overview.length = arr.length
  overview.topSenders = tempArr.slice(0,10)
  return overview
}
export default Vue.extend({
  name: 'LatestPendingTransactions',
  data () {
    return {
      pendingTxs: []
    }
  },
  created () {
    let _this = this
    _this.$emit('updated', getOverview(_this.pendingTxs))
    this.$socket.emit(sEvents.join, 'pendingTxs')
    this.$options.sockets.newPendingTx = (data) => {
      if (Visibility.state() === 'visible') {
        _this.pendingTxs.unshift(new Tx(data))
        _this.$emit('updated', getOverview(_this.pendingTxs))
      }
    }
  },
  beforeDestroy () {
    this.$socket.emit(sEvents.leave, 'pendingTxs')
  }
})
</script>

<style scoped="" lang="less">
  @import "~lessPath/sunil/frames/home.less";
</style>
