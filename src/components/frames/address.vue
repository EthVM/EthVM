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
       <tab-component :tabs="addressTabs"></tab-component>
      <!-- Tab Menu -->
      <div class="tab-menu-container">
        <div class="tab-content">
          <!-- Transactions -->
          <div v-if="addressTabs[0].isActive">
            <div v-if="account.txs">
              <block-address-tx :address='account' :transactions='account.txs'></block-address-tx>
            </div>
            <!-- End Transactions -->
          </div>
          <!-- Tokens -->
          <div v-if="addressTabs[1].isActive" class="" :account="account">
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
          <!-- Pending Transactions -->
          <div v-if="addressTabs[2].isActive" class="">
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
            <!-- End Pending Transactions -->
          </div>
          <div v-if="account.isMiner">
            <div v-if="addressTabs[3].isActive">
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
        </div>
        <!-- End Tab Menu -->
      </div>
    </div>
    <!-- container -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import bn from "bignumber.js";
import {
  common,
  Tx
} from "@/libs";
import ethUnits from "ethereumjs-units";
var utils = require("../../libs/utils.js");

let Account = require("ethereumjs-account");

const MAX_ITEMS = 20;
export default Vue.extend({
  name: "FrameAccount",
  props: ["address", "totalTxs", "tokens", "txs"],
  data() {
    return {
      account: {
        address: this.address,
        balance: 0,
        balanceUSD: 0,
        ethusd: 0,
        totalTxs: this.totalTxs,
        tokens: this.tokens,
        txs: this.txs,
        isMiner: false
      },
      addressTabs: [
        {
          id: 0,
          title: 'Transactions',
          isActive: true,
        },
        {
          id: 1,
          title: 'Tokens',
          isActive: false,
        },
        {
          id: 2,
          title: 'Pending Transactions',
          isActive: false,
        }
      ],
      tokensLoaded: false,
      tokenError: false
    };
  },
  created() {
    var _this = this;
    this.$socket.emit("getBalance", this.address, (err, result) => {
      console.log(err, result);
      if (!err && result) {
        let balance = common
          .EthValue(common.HexToBuffer(result.result))
          .toEth();
        _this.account.balance = balance;
        console.log("account balance in eth: " + _this.account.balance);
      }
    });

    this.$socket.emit("getTokenBalance", this.address, (err, result) => {
      console.log("tokens: " + err, result);
      //_this.account.tokens = utils.decode(result.result)
      if (result.result != "0x") {
        _this.account.tokens = utils.decode(result.result);
        _this.tokensLoaded = true;
      } else {
        _this.tokenError = true;
      }
    });

    this.$socket.emit("getTotalTxs", this.address, (err, result) => {
      console.log(err, result);
      _this.account.totalTxs = result;
    });

    this.$socket.emit("getTokenToUSD", [ 'BTC', 'LTC'],  (err, result) => {
          console.log("results",result)
        _this.account.ethusd = result[0][1];
    });

    this.$socket.emit("getTxs", this.address, (err, result) => {
      var txs = [];
      result.forEach(element => {
        txs.push(new Tx(element));
      });
      _this.account.txs = txs;
    });
    _this.setTabs();
  },
  methods: {
    setTabs () {
      let _this = this
      if(_this.account.isMiner){
        let newTab = {
          id: 3,
          title: 'Mining History',
          isActive: false,
        }
        this.addressTabs.push(newTab)
      }
    }
  },
  computed: {   
    // txs(){
    //     if(this.$store.getters.getTxs.length) return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
    //     else return []
    // }
  }
});
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/frames/address.less";
</style>
