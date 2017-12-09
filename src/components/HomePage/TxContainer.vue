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
        <tr v-for="tx in tempTransactions" v-bind:key="tx.hash">
          <td>{{tx.hash}}</td>
          <td>{{tx.blockNumber}}</td>
          <td>{{tx.from}}</td>
          <td>{{tx.to}}</td>
          <td>{{tx.value}}</td>
          <td>{{tx.gasUsed}}</td>
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
  data () {
    return {
      store: store,
      tempTransactions: []
    }
  },
  mounted: function () {
    let parent = this
    setInterval(() => {
      parent.tempTransactions = []
      if (parent.transactions.length) parent.tempTransactions = parent.transactions.sort(() => 1 - Math.random()).slice(0, 5)
    }, 5000)
  },
  computed: {
    transactions () {
      return store.getters.getTxs.slice(0, 5)
    }
  }
})
</script>

<style lang='less' scoped>
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-transection-table.less";
@import "~lessPath/animations.less";
</style>
