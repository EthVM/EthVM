<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <app-tabs :tabs="pageTabs">
      <!-- Live Data-->
      <v-tab-item slot="tabs-item" value="tab-0">
        <app-card-stats-group />
        <!-- Charts -->
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <chart-live-tx /> </v-flex>
          <v-flex xs12 md6> <chart-live-tx-fees /> </v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Live Block Time --></v-flex>
          <v-flex xs12 md6><!-- Live Difficulty --></v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Transactions-->
      <v-tab-item slot="tabs-item" value="tab-1">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgGasPrice')" :chart-id="ID.gasPrice" /> </v-flex>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgGasLimit')" :chart-id="ID.gasLimit" /> </v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgTxFees')" :chart-id="ID.txFees" /> </v-flex>
          <v-flex xs12 md6><!-- Pending Txs --></v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgTxSuccess')" :chart-id="ID.txSuccess" /> </v-flex>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgTxFail')" :chart-id="ID.txFail" /> </v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Blocks -->
      <v-tab-item slot="tabs-item" value="tab-2">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgBlockTime')" :chart-id="ID.blockTime" /> </v-flex>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgBlockDiff')" :chart-id="ID.difficulty" /> </v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6><!-- Average Block Size --></v-flex>
        </v-layout>
      </v-tab-item>
      <!-- Mining -->
      <v-tab-item slot="tabs-item" value="tab-3">
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgHashRate')" :chart-id="ID.hashRate" /> </v-flex>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.avgMiningReward')" :chart-id="ID.minerReward" /> </v-flex>
        </v-layout>
        <v-layout row wrap justify-center mb-4>
          <v-flex xs12 md6> <app-chart-link :title="$t('charts.topMiners')" :chart-id="ID.topMiners" /> </v-flex>
          <v-flex xs12 md6><!--  --></v-flex>
        </v-layout>
      </v-tab-item>
    </app-tabs>
  </v-container>
</template>

<script lang="ts">
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppChartLink from '@app/modules/charts/components/AppChartLink.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import ChartLiveTx from '@app/modules/charts/components/live/ChartLiveTx.vue'
import ChartLiveTxFees from '@app/modules/charts/components/live/ChartLiveTxFees.vue'
import { ChartTypes } from '@app/modules/charts/helpers'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs,
    AppChartLink,
    AppTabs,
    AppCardStatsGroup,
    ChartLiveTx,
    ChartLiveTxFees
  }
})
export default class PageCharts extends Vue {
  ID = ChartTypes

  data() {
    return {
      crumbs: [
        {
          text: this.$i18n.t('title.charts'),
          disabled: true
        }
      ],
      pageTabs: [
        {
          id: '0',
          title: this.$i18n.t('tabs.live'),
          isActive: true
        },
        {
          id: '1',
          title: this.$i18n.t('title.tx'),
          isActive: false
        },
        {
          id: '2',
          title: this.$i18n.t('title.blocks'),
          isActive: false
        },
        {
          id: '3',
          title: this.$i18n.t('tabs.miningH'),
          isActive: false
        }
      ]
    }
  }
}
</script>
