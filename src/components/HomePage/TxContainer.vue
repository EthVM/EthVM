<template>
  <div class="standard-table-1">
    <p class= "table-title"><icon name='refresh' scale='1'></icon> Latest Transactions</p>

    <transition-group name="list">
      <div class="data-block-loop" v-for="tx in transactions" v-bind:key="tx.getHash()">

        <div class="data-block-1">
          <div>Hash <span>{{tx.getHash()}}</span></div>
          <div>Gas <span>{{tx.getGasUsed.toNumber().toString()}}</span></div>
          <div>Gas Price <span>{{tx.getGasPrice.toEth()}} ETH</span></div>
          <div>Block <span>{{tx.getBlockNumber.toNumber().toString()}}</span></div>
        </div><!-- .data-block-1 -->

        <div class="data-block-2">
          <div>
            <h1>From</h1>
            <p>{{tx.getFrom()}}</p>
          </div>
          <div>
            <div class="data-icon-container">
              <icon name='long-arrow-right' scale='1'></icon>
            </div>
            <p class="amount">{{tx.getValue.toEth()}} ETH</p>
          </div>
          <div>
            <h1>To</h1>
            <p>{{tx.getTo()}}</p>
          </div>
        </div><!-- .data-block-2 -->

      </div><!-- .data-block-loop -->
    </transition-group>
  </div><!-- .standard-table-1 -->
</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  props: [
    'maxItems'
  ],
  data () {
    return {
      store: store
    }
  },
  mounted: function () {},
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
