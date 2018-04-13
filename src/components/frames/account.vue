<template>
  <div id="tx-detail">
    <div class="container">
      
      <!-- Title and Search Bar -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Address Details</h3>
        </div>

        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>

      <!-- Address Deatails -->
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <div class="block-title-container">
            <h3 class="hidden">Address Information</h3>
          </div>
          <div class="block">
            <account-detail :account="account" ></account-detail>
          </div>
        </div>
      </div>
      <!-- Account Transactions -->
      <div class="col-md-6 block-container">
        <div class="block">
          <!--
          <div v-infinite-scroll="loadMore"
               infinite-scroll-disabled="busy"
               infinite-scroll-distance="100">
            <table-transactions-new :transactions="txs"></table-transactions-new>
          </div>
           -->
        </div>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import series from 'async/series';
import bn from 'bignumber.js';
import { common, Tx } from '@/libs';
import axios from 'axios';
import lists from '@/lists';
let Account = require('ethereumjs-account')
let balanceHex = '0x70a08231'
import { txLayout } from '@/typeLayouts';
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
  name: 'FrameAccount',
  props: [
    'address'
  ],
  data() {
    return {
      account: {
        address: this.address,
        balance: common.EthValue(new Buffer(0)),
        tokens: []
      },
      txs: []
    }
  },
  created() {
    let _this = this
    this.$socket.emit('getAddressTransactionPages', {
      address: new Buffer(_this.address.substring(2), 'hex')
    }, (err: Error, data: Array<txLayout>) => {
      if (err) {
        _this.$toasted.error(err.message)
      } else {
        _this.txs = data.map((_tx) => {
          return new Tx(_tx)
        })
      }
    }) 
    _this.$socket.emit('getAccount', _this.address, (err, result) => {
      console.log(err, result)
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
    _this.$socket.emit('ethCall', reqArr, (err, result) => {
      if (!err && result) {
        result.forEach((result, idx) => {
          if (!result.error) {
            let res = new Buffer(result.result)
            if (res.length === 32 && new bn('0x' + res.toString('hex')).gt(0)) {
              tokens[idx].balance = new bn('0x' + new Buffer(res).toString('hex')).div(new bn(10).pow(tokens[idx].decimals))
              _this.account.tokens.push(tokens[idx])
            }
          }
        })
      }
    })
  },
  methods: {
    loadMore() {
      let _this = this
      if (_this.txs.length) {
        this.busy = true
        this.$socket.emit('getAddressTransactionPages', {
          address: new Buffer(_this.address.substring(2), 'hex'),
          hash: _this.txs[_this.txs.length - 1].getHash().toBuffer(),
          number: _this.txs[_this.txs.length - 1].getBlockNumber().toIntNumber()
        }, (err: Error, data: Array<txLayout>) => {
          if (err) {
            _this.$toasted.error(err.message)
          } else {
            data.forEach((_tx) => {
              _this.txs.push(new Tx(_tx))
            })
          }
          _this.busy = false
        })
      }
    }
  }

})

</script>

<style scoped="" lang="less">
@import "~lessPath/NewHome/Frames/FramesOverview.less";
</style>

