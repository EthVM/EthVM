<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <app-tabs :tabs="pageTabs">
      <!--
      =====================================================================================
        LIVE CHARTS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-0">
        <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12>
            <app-card-stats-group />
          </v-flex>
        </v-layout>
        <!-- Charts -->
        <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12 md6> <chart-live-txs /> </v-flex>
          <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
        </v-layout>
        <!-- <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12 md6>
             Live Block Time
          </v-flex>
          <v-flex xs12 md6>
             Live Difficulty
          </v-flex>
        </v-layout> -->
      </v-tab-item>

      <!--
      =====================================================================================
        BLOCKS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-1">
        <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12 md6> <chart-link :title="$t('charts.gas-price.title')" :text="$t('charts.gas-price.description')" :chart-id="ChartType.gasPrice" /> </v-flex>
          <v-flex xs12 md6> <chart-link :title="$t('charts.gas-limit.title')" :text="$t('charts.gas-limit.description')" :chart-id="ChartType.gasLimit" /> </v-flex>
          <v-flex xs12 md6> <chart-link :title="$t('charts.tx-success.title')" :text="$t('charts.tx-success.description')" :chart-id="ChartType.txSuccess" /> </v-flex>
          <v-flex xs12 md6> <chart-link :title="$t('charts.tx-fail.title')" :text="$t('charts.tx-fail.description')" :chart-id="ChartType.txFail" /> </v-flex>
          <v-flex xs12 md6> <chart-link :title="$t('charts.tx-fees.title')" :text="$t('charts.tx-fees.description')" :chart-id="ChartType.txFees" /> </v-flex>
          <v-flex xs12 md6>
            <!-- Average Block Size -->
          </v-flex>
        </v-layout>
      </v-tab-item>

      <!--
      =====================================================================================
        TRANSACTIONS TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-2">
        <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12 md6> <chart-link :title="$t('charts.block-time.title')" :text="$t('charts.block-time.description')" :chart-id="ChartType.blockTime" /> </v-flex>
          <v-flex xs12 md6>
            <chart-link :title="$t('charts.block-diff.title')" :text="$t('charts.block-diff.description')" :chart-id="ChartType.difficulty" />
          </v-flex>
          <!-- <v-flex xs12 md6>
          Average Block Size
          </v-flex> -->
        </v-layout>
      </v-tab-item>

      <!--
      =====================================================================================
        MINING TAB
      =====================================================================================
      -->
      <v-tab-item slot="tabs-item" value="tab-3">
        <v-layout row wrap justify-center :class="contentClass">
          <v-flex xs12 md6> <chart-link :title="$t('charts.hash-rate.title')" :text="$t('charts.hash-rate.description')" :chart-id="ChartType.hashRate" /> </v-flex>
          <v-flex xs12 md6>
            <!--  -->
          </v-flex>
        </v-layout>
      </v-tab-item>
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import ChartLink from '@app/modules/charts/components/ChartLink.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import ChartLiveTxs from '@app/modules/charts/components/live/ChartLiveTxs.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import { ChartTypes } from '@app/modules/charts/helpers'
import { Vue, Component } from 'vue-property-decorator'
import { Tab, Crumb } from '@app/core/components/props'

@Component({
  components: {
    AppBreadCrumbs,
    AppTabs,
    AppCardStatsGroup,
    ChartLink,
    ChartLiveTxs,
    ChartLiveTxFees
  }
})
export default class PageCharts extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
  ChartType = ChartTypes

  /*
  ===================================================================================
    Computed
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: 'charts.name',
        disabled: true
      }
    ]
  }

  get pageTabs(): Tab[] {
    return [
      {
        id: 0,
        title: this.$i18n.t('charts.live'),
        isActive: true
      },
      {
        id: 1,
        title: this.$i18n.tc('tx.name', 2),
        isActive: false
      },
      {
        id: 2,
        title: this.$i18n.tc('block.name', 2),
        isActive: false
      },
      {
        id: 3,
        title: this.$i18n.t('miner.history'),
        isActive: false
      }
    ]
  }

  get contentClass(): String {
    return this.$vuetify.breakpoint.name === 'xs' ? 'ma-0' : 'ma-2'
  }
}
</script>
