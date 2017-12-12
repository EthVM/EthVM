<template>
  <table class="latest-blocks-table">
    <thead>
      <tr>
        <td>Height</td>
        <td>Hash</td>
        <td>Transactions</td>
        <td>Block Reward</td>
        <td>Tx Fees</td>
        <td>Miner</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="block in blocks" v-if="!block.getIsUncle()">
        <td>{{block.getIntNumber()}}</td>
        <td>{{block.getHash()}}</td>
        <td>{{block.getTransactions().length}}</td>
        <td>{{block.getBlockReward.toEth()}} ETH</td>
        <td>{{block.getTxFees.toEth()}} ETH</td>
        <td>{{block.getMiner()}}</td>
      </tr>
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
  mounted: function () {

  },
  computed: {
    blocks () {
      return store.getters.getBlocks.slice(0, this.maxItems)
    }
  }
})
</script>

<style lang='less'>
@import "~lessPath/frontpage.less";
@import "~lessPath/latest-blocks-table";
</style>
