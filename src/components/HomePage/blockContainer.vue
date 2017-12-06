<template>
  <table class="latest-blocks-table">
    <thead>
      <tr>
        <td>Hash</td>
        <td>Age</td>
        <td>Transactions</td>
        <td>Block Reward</td>
        <td>Miner</td>
        <td>Gas Limit</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="block in blocks">
        <td>{{block.hash}}</td>
        <td>{{block.age}}</td>
        <td>{{block.numTransactions}}</td>
        <td>{{block.rewards}}</td>
        <td>{{block.miner}}</td>
        <td>{{block.gasLimit}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import Blocks from '@/sampleData/blocks.json'
import store from '@/states'
export default Vue.extend({
  name: 'block-container',
  data () {
    return {
      store: store
    }
  },
  mounted: function () {
    store.commit('setBlocks', Blocks)
  },
  computed: {
    blocks () {
      return store.getters.getBlocks
    }
  }
})
</script>

<style lang='less'>
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-blocks-table";
</style>
