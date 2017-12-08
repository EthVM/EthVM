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
        <td>{{block.timestamp}}</td>
        <td>{{block.transactions.length}}</td>
        <td>{{block.blockReward}}</td>
        <td>{{block.miner}}</td>
        <td>{{block.gasLimit}}</td>
      </tr>
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
      store: store
    }
  },
  mounted: function () {

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
