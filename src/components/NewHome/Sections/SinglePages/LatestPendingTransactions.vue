<template>
  <table-transactions-new :transactions="pendingTxs"></table-transactions-new>
</template>


<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import { Tx } from '@/libs'
import Visibility from 'visibilityjs'
export default Vue.extend({
  name: 'LatestPendingTransactions',
  data () {
    return {
      pendingTxs: []
    }
  },
  created () {
    let _this = this
    this.$socket.emit(sEvents.join, 'pendingTxs')
    this.$options.sockets.newPendingTx = (data) => {
      if (Visibility.state() === 'visible') {
        _this.pendingTxs.unshift(new Tx(data))
      }
    }
  },
  beforeDestroy () {
    this.$socket.emit(sEvents.leave, 'pendingTxs')
  }
})
</script>

<style scoped="" lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TableTransactions.less";
</style>
