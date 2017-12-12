<template>
<table class="latest-transection-table">
  <thead>
    <tr>
      <td>Hash</td>
      <td>Block Number</td>
      <td>From</td>
      <td>To</td>
      <td>Value</td>
      <td>Gas Used</td>
    </tr>
  </thead>
  <tbody>
    <transition-group name="list">
      <tr v-for="tx in transactions"
          v-bind:key="tx.getHash()">
        <td>{{tx.getHash()}}</td>
        <td>{{tx.getBlockNumber.toNumber().toString()}}</td>
        <td>{{tx.getFrom()}}</td>
        <td>{{tx.getTo()}}</td>
        <td>{{tx.getValue.toEth()}}</td>
        <td>{{tx.getGasUsed.toNumber().toString()}}</td>
      </tr>
    </transition-group>
  </tbody>
</table>

</template>

<script lang="ts">
import Vue from 'vue'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  props: ['maxItems'],
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
