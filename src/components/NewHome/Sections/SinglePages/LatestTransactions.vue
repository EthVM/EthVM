<template>
<div v-infinite-scroll="loadMore"
     infinite-scroll-disabled="busy"
     infinite-scroll-distance="100">
  <table-transactions-new :transactions="txs"></table-transactions-new>
</div>

</template>

<script lang="ts">
import Vue from 'vue';
import sEvents from '@/configs/socketEvents.json';
import Visibility from 'visibilityjs';
import { Tx } from '@/libs';
import { txLayout } from '@/typeLayouts';
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
  name: 'LatestTransactions',
  props: [],
  data() {
    return {
      txs: [],
      busy: false
    }
  },
  beforeMount() {},
  created() {
    let _this = this
    this.$socket.emit('getTransactionPages', '', (err: Error, data: Array<txLayout>) => {
      if (err) {
        _this.$toasted.error(err.message)
      } else {
        _this.txs = data.map((_tx) => {
          return new Tx(_tx)
        })
        _this.$emit('updated', getOverview(_this.txs))
      }
    })
  },
  methods: {
    loadMore() {
      let _this = this
      if (_this.txs.length) {
        this.busy = true
        this.$socket.emit('getTransactionPages', {
          hash: _this.txs[_this.txs.length - 1].getHash().toBuffer(),
          number: _this.txs[_this.txs.length - 1].getBlockNumber().toIntNumber()
        }, (err: Error, data: Array<txLayout>) => {
          if (err) {
            _this.$toasted.error(err.message)
          } else {
            data.forEach((_tx) => {
              _this.txs.push(new Tx(_tx))
            })
            _this.$emit('updated', getOverview(_this.txs))
          }
          _this.busy = false
        })
      }
    }
  }
})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/latestTransactions';
</style>
