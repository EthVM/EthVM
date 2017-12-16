<template>
<div class="standard-table-1">
  <p class="table-title">
    <icon name='refresh'
          scale='1'></icon> Latest Transactions</p>
  <transition-group name="list">
    <div class="data-block-loop"
         v-for="tx in txSplice"
         v-bind:key="tx.getHash()">
      <div class="data-block-1">
        <div>Hash <span>{{tx.getHash()}}</span></div>
        <div>Gas <span>{{tx.getGasUsed.toNumber().toString()}}</span></div>
        <div>Gas Price(Eth) <span>{{tx.getGasPrice.toEth()}}</span></div>
        <div>Block <span>{{tx.getBlockNumber.toNumber().toString()}}</span></div>
      </div>
      <!-- .data-block-1 -->
      <div class="data-block-2">
        <div>
          <h1>From</h1>
          <p>{{tx.getFrom()}}</p>
        </div>
        <div>
          <div class="data-icon-container">
            <icon name='long-arrow-right'
                  scale='1'></icon> <span>(ETH)</span>
          </div>
          <p class="amount">{{tx.getValue.toEth()}}</p>
        </div>
        <div>
          <h1>To</h1>
          <p>{{tx.getTo()}}</p>
        </div>
      </div>
      <!-- .data-block-2 -->
      <div>
        <!--sub txs -->
        <div v-for="transfer in tx.getTrace().transfers">
          <h1>From</h1>
          <p>{{transfer.from}}</p>
          <h1>To</h1>
          <p>{{transfer.to}}</p>
          <h1>Value</h1>
          <p>{{transfer.value}}</p>
          <h1>Type</h1>
          <p>{{transfer.op}}</p>
        </div>
      </div>
      <!--sub txs -->
    </div>
    <!-- .data-block-loop -->
  </transition-group>
</div>
<!-- .standard-table-1 -->

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
// import _ from 'lodash'
export default Vue.extend({
  name: 'block-container',
  props: [
    'maxItems'
  ],
  data () {
    return {
      store: store,
      txSplice: []
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.txSplice = this.transactions
      let parent = this
      setInterval(() => {
        parent.txSplice = parent.transactions
      }, 500)
    }
    )
  },
  computed: {
    transactions () {
      return store.getters.getTxs.slice(0, this.maxItems)
    }
  }
})
</script>

<style lang="less" scoped="">
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-transection-table.less";
@import "~lessPath/animations.less";
</style>
