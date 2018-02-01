<template>
<div class="token-tracker">
  <div class="block-container">
    <div class="section-block-container">
      <p class="block-title">Token Tracker</p>
      <div class="section-block">        
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        <li>89734hrf89hf9h349h39fh983h9</li>
        <li>12 eth</li>
        
      </div>

      <div class="section-block-total">
        <li>Total Value:</li>
        <li>200 eth</li>
      </div>

    </div>
    <!-- .section-block-container -->
  </div>
  <!-- .block-container -->
</div>

</template>

<script lang="ts">
import Vue from 'vue';
import bn from 'bignumber.js';
import { common } from '@/libs';
import axios from 'axios';
import lists from '@/lists';
let Account = require('ethereumjs-account')
let balanceHex = '0x70a08231'
let padLeft = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}
let getDataObj = (to, func, arrVals) => {
  var val = ''
  for (var i = 0; i < arrVals.length; i++) {
    val += padLeft(arrVals[i], 64, '0')
  }
  return {
    to: to,
    data: func + val
  }
}
export default Vue.extend({
  name: 'token-tracker',
  props: [
    
  ],
  data() {
    return {
    
    }
  },
  created() {
  },
  methods: { }

})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/TokenTracker';
</style>
