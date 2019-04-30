<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <chart-block-diff v-if="chartId === ChartType.difficulty" />
    <chart-block-time v-if="chartId === ChartType.blockTime" />
    <chart-gas-limit v-if="chartId === ChartType.gasLimit" />
    <chart-gas-price v-if="chartId === ChartType.gasPrice" />
    <chart-hash-rate v-if="chartId === ChartType.hashRate" />
    <chart-tx-fail v-if="chartId === ChartType.txFail" />
    <chart-tx-success v-if="chartId === ChartType.txSuccess" />
    <chart-tx-fees v-if="chartId === ChartType.txFees" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import ChartBlockDiff from '@app/modules/charts/components/history/ChartBlockDiff.vue'
import ChartBlockTime from '@app/modules/charts/components/history/ChartBlockTime.vue'
import ChartGasLimit from '@app/modules/charts/components/history/ChartGasLimit.vue'
import ChartGasPrice from '@app/modules/charts/components/history/ChartGasPrice.vue'
import ChartHashRate from '@app/modules/charts/components/history/ChartHashRate.vue'
import ChartTxFail from '@app/modules/charts/components/history/ChartTxFail.vue'
import ChartTxSuccess from '@app/modules/charts/components/history/ChartTxSuccess.vue'
import ChartTxFees from '@app/modules/charts/components/history/ChartTxFees.vue'
import { ChartTypes } from '@app/modules/charts/helpers'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    AppBreadCrumbs,
    ChartBlockDiff,
    ChartBlockTime,
    ChartGasLimit,
    ChartGasPrice,
    ChartHashRate,
    ChartTxFail,
    ChartTxSuccess,
    ChartTxFees
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
