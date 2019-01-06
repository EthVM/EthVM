<template>
  <div id="charts">
    <div class="container">
      <div class="page-title-container">
        <div class="page-title">
          <h3>{{ $t('title.charts') }}</h3>
          <h6 class="text-muted">{{ $t('subTitle.charts') }}</h6>
        </div>
        <div class="search-block"><block-search></block-search></div>
      </div>
      <div id="exTab1">
        <ul class="nav-p">
          <li @click="nav1on" :class="{ active: nav1 }">General</li>
          <li @click="nav2on" :class="{ active: nav2 }">Transaction History</li>
          <li @click="nav3on" :class="{ active: nav3 }">Network History</li>
          <li @click="nav4on" :class="{ active: nav4 }">Mining History</li>
        </ul>
        <div class="tab-content">
          <div v-if="nav1 === true" class>
            <div class="row">
              <div class="col-md-12"><top-miners-chart></top-miners-chart></div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Block Time</h4></div>
                <account-created-chart></account-created-chart>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Block Size</h4></div>
                <block-size-chart></block-size-chart>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Block Size</h4></div>
                <gas-limit-chart></gas-limit-chart>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Avg Tx Fee</h4></div>
                <tx-fee-chart></tx-fee-chart>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Total Accounts</h4></div>
                <!-- <line-chart-ave-tx-fees></line-chart-ave-tx-fees> -->
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Total Transactions</h4></div>
                <!-- <line-chart-ave-tx-fees></line-chart-ave-tx-fees> -->
              </div>
            </div>
          </div>
          <div v-if="nav2 === true" class>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Sucessfull Tx History</h4></div>
                <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Failed Tx History</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Pending Tx History</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Gas Limit History</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Tx Fees</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Gas Price</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
            </div>
          </div>
          <div v-if="nav3 === true" class>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Hash Rate</h4></div>
                <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Difficulty</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
            </div>
            <!-- Section: Network -->
            <div class="row">
              <div class="block-title-container-desc">
                <div class="col-md-12">
                  <h3>Mining History</h3>
                  <h6>Miners and rewards stats</h6>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Best Miner</h4></div>
                <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
              </div>
              <div class="col-md-6">
                <div class="block-title-container-desc"><h4>Mining Rewards</h4></div>
                <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
              </div>
            </div>
          </div>
          <div v-if="nav4 === true" class></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component
export default class PageCharts extends Vue {
  nav1: boolean = true
  nav2: boolean = false
  nav3: boolean = false
  nav4: boolean = false

  // Computed
  get txs() {
    if (this.$store.getters.getTxs.length) {
      return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
    }
    return []
  }

  // Methods
  alloff() {
    this.nav1 = false
    this.nav2 = false
    this.nav3 = false
    this.nav4 = false
  }

  nav1on() {
    this.alloff()
    this.nav1 = true
  }

  nav2on() {
    this.alloff()
    this.nav2 = true
  }

  nav3on() {
    this.alloff()
    this.nav3 = true
  }

  nav4on() {
    this.alloff()
    this.nav4 = true
  }
}
</script>

<style scoped lang="less">
@import '~lessPath/sunil/frames/charts.less';
</style>
