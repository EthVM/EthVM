<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />

    <chart-timeseries
      v-if="chartId === ChartType.difficulty"
      :title="$i18n.t('charts.block-diff.title')"
      :description="$i18n.t('charts.block-diff.description')"
      :query="this.queries.get('avgDifficulty')"
      :value-type="'bignumber'"
    />

    <chart-timeseries
      v-if="chartId === ChartType.blockTime"
      :title="$i18n.t('charts.block-time.title')"
      :description="$i18n.t('charts.block-time.description')"
      :query="this.queries.get('avgBlockTime')"
    />

    <chart-timeseries
      v-if="chartId === ChartType.gasLimit"
      :title="$i18n.t('charts.gas-limit.title')"
      :description="$i18n.t('charts.gas-limit.description')"
      :query="queries.get('avgGasLimit')"
      :value-type="'bignumber'"
    />

    <chart-timeseries
      v-if="chartId === ChartType.gasPrice"
      :title="$i18n.t('charts.gas-price.title')"
      :description="$i18n.t('charts.gas-price.description')"
      :query="this.queries.get('avgGasPrice')"
      :value-type="'gwei'"
    />

    <chart-hash-rate v-if="chartId === ChartType.hashRate" />

    <chart-timeseries
      v-if="chartId === ChartType.txFail"
      :title="$i18n.t('charts.tx-fail.title')"
      :description="$i18n.t('charts.tx-fail.description')"
      :query="this.queries.get('avgNumFailedTxs')"
    />

    <chart-timeseries
      v-if="chartId === ChartType.txSuccess"
      :title="$i18n.t('charts.tx-success.title')"
      :description="$i18n.t('charts.tx-success.description')"
      :query="this.queries.get('avgNumSuccessfulTxs')"
    />

    <chart-timeseries
      v-if="chartId === ChartType.txFees"
      :title="$i18n.t('charts.tx-fees.title')"
      :description="$i18n.t('charts.tx-fees.description')"
      :query="this.queries.get('avgTxFees')"
      :value-type="'eth'"
    />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import ChartHashRate from '@app/modules/charts/components/history/ChartHashRate.vue'
import { ChartTypes } from '@app/modules/charts/helpers'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'
import ChartTimeseries from '@app/modules/charts/components/history/ChartTimeseries.vue'
import {
  avgGasPriceHistory,
  avgBlockTimeHistory,
  avgGasLimitHistory,
  avgDifficultyHistory,
  avgNumFailedTxsHistory,
  avgNumSuccessfulTxsHistory,
  avgTxFeesHistory
} from '@app/modules/charts/components/history/timeseries.graphql'

@Component({
  components: {
    AppBreadCrumbs,
    ChartHashRate,
    ChartTimeseries
  }
})
export default class PageDetailsChart extends Vue {
  /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
  ChartType = ChartTypes

  /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

  get queries(): Map<string, any> {
    const map = new Map<string, any>()
    return map
      .set('avgGasPrice', avgGasPriceHistory)
      .set('avgBlockTime', avgBlockTimeHistory)
      .set('avgGasLimit', avgGasLimitHistory)
      .set('avgDifficulty', avgDifficultyHistory)
      .set('avgNumFailedTxs', avgNumFailedTxsHistory)
      .set('avgNumSuccessfulTxs', avgNumSuccessfulTxsHistory)
      .set('avgTxFees', avgTxFeesHistory)
  }

  get crumbs(): Crumb[] {
    return [
      {
        text: 'charts.name',
        disabled: false,
        link: '/charts'
      },
      {
        text: this.crumbString,
        disabled: true
      }
    ]
  }

  get chartId(): string {
    return this.$route.params.chartRef
  }

  get crumbString(): string {
    return `charts.${this.chartId}.title`
  }
}
</script>
