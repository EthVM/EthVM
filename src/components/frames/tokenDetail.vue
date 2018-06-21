<template>
  <div class="">
    <div class="container">
      <!-- Top Container -->
      <div class="page-title-container">
        <div class="page-title">
          <h3>Token</h3>
          <h6 class="text-muted">Overview/Transfers history</h6>
        </div>
        <div class="search-block">
          <block-search></block-search>
        </div>
        <!-- End Top Container -->
      </div>
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12">
          <block-token-detail :token="token" :isHolder="holderPresent"></block-token-detail>
        </div>
      </div>
      <!-- Tab Menu -->
      <tab-component :tabs="tokenTabs"></tab-component>
      <div class="tab-menu-container">
        <div class="tab-content">
          <!-- Transfers 
          <div v-if="tokenTabs[0].isActive">
            <div v-if="account.txs">
            </div>
            <!End Transfers -->
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
  props: ['tokenAddr', 'holderAddr'],
  data() {
    return {
      tokenTabs: [{
        id: 0,
        title: 'Transfers',
        isActive: true,
      }],
      /*Dummy Data: */
      token: {
        name: 'newName',
        holder: this.holderAddr,
        balance: 12,
        valueUSD: 249,
        symbol: 'SNM',
        transfers: 4280,
        valueETH: 234,
        contract: this.tokenAddr,
        decimals: 27,
        totalSupply: 1234324,
        totalHolders: 2434,
      },
    };
  },
  created() {
    var _this = this
      /* Get Transfers History: */

    /* If (holderPresent) 
      Get Total Holders:
      Get Total Supply: */

    if (!_this.holderPresent) {
      var newTab = {
        id: 1,
        title: 'Holders List',
        isActive: false
      }
      _this.tokenTabs.push(newTab)
    }
  },
  methods: {},
  computed: {
    holderPresent() {
      let _this = this
      if (_this.holderAddr) return true
      return false
    },
  }
});
</script>
<style scoped="" lang="less">
@import "~lessPath/sunil/global.less";
</style>
