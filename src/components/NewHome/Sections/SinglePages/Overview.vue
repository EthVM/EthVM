<template>
<div class="overview">
  <div class="block-container">
    <div class="section-block-container">
      <p class="block-title">Overview</p>
      <div class="section-block">        
          <li>Address</li>
          <li>{{address}}</li>
          <li>Balance</li>
          <li>{{account.balance.toEth()}}</li>
      </div>
      <div class="section-block" v-for="token in account.tokens">
        <li>Symbol</li>
        <li>{{token.symbol}}</li>
        <li>Balance</li>
        <li>{{token.balance.toFixed()}}</li>
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
  name: 'Overview',
  props: [
    'address'
  ],
  data() {
    return {
      account: {
        balance: common.EthValue(new Buffer(0)),
        tokens: []
      }
    }
  },
  created() {
    let _this = this
    _this.$socket.emit('getAccount', _this.address, (err, result) => {
      if (!err && result) {
        let acc = new Account(new Buffer(result))
        _this.account.balance = common.EthValue(acc.balance)
      }
    })
    let tokens = lists.tokens.ETH
    let counter = 0
    let reqArr = []
    tokens.forEach((_token) => {
      let to = _token.address.trim()
      let data = getDataObj(to, balanceHex, [
        common.AddressFromHex(_this.address.trim()).toNakedAddress()
      ])
      reqArr.push(data)
    })
    let sTime = new Date().getTime()
    _this.$socket.emit('ethCall', reqArr, (err, result) => {
      if (!err && result) {
        console.log(new Date().getTime() - sTime)
        result.forEach((result, idx) => {
          if (!result.error) {
            let res = new Buffer(result.result)
            if (res.length == 32  && new bn('0x' + res.toString('hex')).gt(0)) {
              tokens[idx].balance = new bn('0x' + new Buffer(res).toString('hex')).div(new bn(10).pow(tokens[idx].decimals))
              _this.account.tokens.push(tokens[idx])
            }
          }
        })
      }
    })
  },
  methods: { }

})

</script>

<style scoped="" lang="less">
@import '~lessPath/NewHome/Sections/SinglePages/overview';
</style>
