<template>
<div class="overview">
  <div class="block-container">
    <div class="section-block-container">
      <p class="block-title">Overview</p>
      <div class="section-block">        
          <li>Address</li>
          <li>{{account.address}}</li>
          <li>Balance</li>
          <li>{{account.balance.toEth()}}</li>
      </div>
    </div>
    <!-- .section-block-container -->
  </div>
  <!-- .block-container -->
</div>

</template>

<script lang="ts">
import Vue from 'vue'
const MAX_ITEMS = 20
var LRU = require('lru')
var cache = new LRU(2)
console.log(cache.get('foo3'))
export default Vue.extend({
  name: 'AccountOverview',
  props: ['account'],
  data () {
    return {}
  },
  created (){},
  computed:{}
})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/overview';
</style>
