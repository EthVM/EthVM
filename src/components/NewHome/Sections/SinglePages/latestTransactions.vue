<template>
  <table-transactions :transactions="transactions"></table-transactions>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import Visibility from 'visibilityjs'
export default Vue.extend({
  name: 'LatestTransactions',
  props: ['maxItems'],
  data () {
    return {
      txs: []
    }
  },
  beforeMount () {},
  created () {
    let _this = this
    _this.txs = _this.$store.getters.getTxs
    _this.$eventHub.$on(sEvents.newTx, (_tx) => {
      if (Visibility.state() === 'visible') {
        _this.txs = _this.$store.getters.getTxs
      }
    })
  },
  beforeDestroy () {
    this.$eventHub.$off(sEvents.newTx)
  },
  computed: {
    transactions () {
      return this.txs.slice(0, this.maxItems)
    }
  },
  mounted () {}
})
</script>

<style scoped="" lang="less">
  @import '~lessPath/NewHome/Sections/SinglePages/latestTransactions';

</style>
