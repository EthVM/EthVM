<template>
  <div class="top-10-senders">  
    <p class="block-title">Top Senders</p>
    <div class="people-list-table" v-for="(sender, index) in senders">
      <li class="ranking">{{index+1}}</li>
      <li class="info">
        <p class="address">{{sender.address}}</p>
        <p class="sent">Sent: <span>{{convertBNtoEth(sender.value)}} ETH</span></p>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ethUnits from 'ethereumjs-units'
export default Vue.extend({
  name: 'Top10Senders',
  props: ['senders'],
  data () {
    return {}
  },
  methods: {
    convertBNtoEth: (_bn) => {
      return ethUnits.convert(_bn.toFixed(),'wei', 'eth')
    }
  }
  })
</script>

<style scoped="" lang="less">
  @import "~lessPath/NewHome/Sections/Tables/TablesTop10Senders.less";
</style>
