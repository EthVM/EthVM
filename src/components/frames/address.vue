<template>
  <div class="">
    <div class="container">
      <div class="page-title-container">
        <div class="page-title">
          <h3>Address Overview</h3>
          <h6 class="text-muted">Ethereum wallet address overview / Transactions information</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
      </div>
      <address-detail :account="account"></address-detail>
      <!-- Tab Menu -->
      <div class="tab-menu-container">
        <ul class="tabs">
          <li v-on:click="nav1on" v-bind:class="{ active: nav1 }">Transactions</li>
          <li v-on:click="nav2on" v-bind:class="{ active: nav2 }">Tokens</li>
          <li v-on:click="nav3on" v-bind:class="{ active: nav3 }">Network History</li>
          <li v-on:click="nav4on" v-bind:class="{ active: nav4 }">Mining History</li>
        </ul>
        <div class="tab-content">
          <!-- Transactions -->
          <div v-if="nav1 === true" class="">
            <div class="content" v-if="account.totalTxs === 0">
              <p> There are no transactions </p>
            </div>
            <div v-else>
              <block-last-transactions2 :transactions="account.txs" :showheader="true"></block-last-transactions2>
            </div>
            <!-- End Transactions -->
          </div>
          <!-- Tokens -->
          <div v-if="nav2 === true" class="" :account="account">
            <div v-if="!tokenError">
              <div v-if="tokensLoaded">
                <block-token-tracker :tokens="account.tokens"></block-token-tracker>
              </div>
              <div v-else class="loading-tokens">
                <i class="fa fa-spinner fa-pulse fa-4x fa-fw"></i>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
            <div v-else class="info">
              <p> Oops Something Went Wrong :( </p>
            </div>
            <!-- End Tokens -->
          </div>
          <div v-if="nav3 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab net-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
          <div v-if="nav4 === true" class="">
            <button class="top-right-button-common">More</button>
            <div class="sub-tab mining-history-container">
              <ul>
                <li>Name:</li>
                <li>TWN</li>
                <li>Balance:</li>
                <li>20,930 TWN</li>
                <li>Value:</li>
                <li>$0.00</li>
                <li>ERC 20 Contract:</li>
                <li>0x045619099665fc6f661b1745e5350290ceb933f</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- End Tab Menu -->
      </div>
    </div>
    <!-- container -->
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import bn from 'bignumber.js';
import {
  common,
  Tx
} from '@/libs';
import ethUnits from 'ethereumjs-units'
var utils = require("../../libs/utils.js")


let Account = require('ethereumjs-account')

const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FrameAccount',
  props: [
    'address',
    'totalTxs',
    'tokens',
    'txs'
  ],
  data() {
    return {
      account: {
        address: this.address,
        balance: 0,
        balanceUSD: 0,
        ethusd: 0,
        totalTxs: this.totalTxs,
        tokens: this.tokens,
        txs: this.txs
      },

      nav1: true,
      nav2: false,
      nav3: false,
      nav4: false,
      nav5: false,

      tokensLoaded: false,
      tokenError: false,

    }
  },
  created() {
    var _this = this;
    this.$socket.emit('getBalance', this.address, (err, result) => {
      console.log(err, result)
      if (!err && result) {
        let balance = common.EthValue(common.HexToBuffer(result.result)).toEth()
        _this.account.balance = balance
        console.log("account balance in eth: " + _this.account.balance)

        ethtousd().then(function(resp) {
          console.log("price: " + resp[0].price_usd)
          _this.account.ethusd = resp[0].price_usd
        })



      }
    })

    this.$socket.emit('getTokenBalance', this.address, (err, result) => {
      console.log(err, result)
      //_this.account.tokens = utils.decode(result.result)
      console.log(_this.account.tokens)
      if (result.result !="0x") {
        _this.account.tokens = utils.decode(result.result)
        _this.tokensLoaded = true
      }
      else {
        _this.tokenError = true
      }
    })

    this.$socket.emit('getTotalTxs', this.address, (err, result) => {
      console.log(err, result)
      _this.account.totalTxs = result;

    })

    this.$socket.emit('getTxs', this.address, (err, result) => {
      var txs = [];
      result.forEach(element => {
        txs.push(new Tx(element))
      });
      _this.account.txs = txs;
    })



  },
  methods: {
    alloff() {
      this.nav1 = false
      this.nav2 = false
      this.nav3 = false
      this.nav4 = false
      this.nav5 = false
    },

    nav1on() {
      this.alloff()
      this.nav1 = true
    },

    nav2on() {
      this.alloff()
      this.nav2 = true
    },

    nav3on() {
      this.alloff()
      this.nav3 = true
    },

    nav4on() {
      this.alloff()
      this.nav4 = true
    },

    nav5on() {
      this.alloff()
      this.nav5 = true
    }
  },
  computed: {
    // txs(){
    //     if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
    //     else return []
    // }
  }

})

async function ethtousd() {
  const response = await fetch("https://api.coinmarketcap.com/v1/ticker/ethereum/", {
    // mode: 'cors', 
    // headers: new Headers({
    //  'Content-Type': 'text/plain'
    // })
  })
  const parsedResponse = await response.json()
  return parsedResponse
}
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/frames/address.less";
</style>
