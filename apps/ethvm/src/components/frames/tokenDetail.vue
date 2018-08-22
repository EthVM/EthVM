<template>
  <div class="container">
    <!-- Top Container -->
    <div class="page-title-container">
      <div class="page-title">
        <h3>{{ $t('title.tokenDetail') }}</h3>
        <h6 class="text-muted">{{ $t('subTitle.tokenDetail') }}</h6>
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
  <!-- container -->
</template>

<script lang="ts">
import { common, Tx } from '@app/libs'
import bn from 'bignumber.js'
import Account from 'ethereumjs-account'
import ethUnits from 'ethereumjs-units'
import Vue from 'vue'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FrameAccount',
  props: ['tokenAddr', 'holderAddr'],
  data() {
    return {
      tokenTabs: [
        {
          id: 0,
          title: 'Transfers',
          isActive: true
        }
      ],
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
        totalHolders: 2434
      }
    }
  },
  created() {
    /* Get Transfers History: */

    /* If (holderPresent)
        Get Total Holders:
        Get Total Supply: */

    if (!this.holderPresent) {
      const newTab = {
        id: 1,
        title: 'Holders List',
        isActive: false
      }
      this.tokenTabs.push(newTab)
    }
  },
  computed: {
    holderPresent() {
      if (this.holderAddr) {
        return true
      }
      return false
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
