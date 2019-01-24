<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <chart-block-diff v-if="chartId === ChartType.difficulty" />
    <chart-block-time v-if="chartId === ChartType.blockTime" />
    <chart-block-size v-if="chartId === ChartType.blockSize" />
    <chart-gas-limit v-if="chartId === ChartType.gasLimit" />
    <chart-gas-price v-if="chartId === ChartType.gasPrice" />
    <chart-hash-rate v-if="chartId === ChartType.hashRate" />
    <chart-tx-fail v-if="chartId === ChartType.txFail" />
    <chart-tx-success v-if="chartId === ChartType.txSuccess" />
    <chart-tx-fees v-if="chartId === ChartType.txFees" />
    <chart-uncles-number v-if="chartId === ChartType.uncles" />
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import ChartBlockDiff from '@app/modules/charts/components/history/ChartBlockDiff.vue'
import ChartBlockSize from '@app/modules/charts/components/history/ChartBlockSize.vue'
import ChartBlockTime from '@app/modules/charts/components/history/ChartBlockTime.vue'
import ChartGasLimit from '@app/modules/charts/components/history/ChartGasLimit.vue'
import ChartGasPrice from '@app/modules/charts/components/history/ChartGasPrice.vue'
import ChartHashRate from '@app/modules/charts/components/history/ChartHashRate.vue'
import ChartMiningReward from '@app/modules/charts/components/history/ChartMiningReward.vue'
import ChartTopMiners from '@app/modules/charts/components/history/ChartTopMiners.vue'
import ChartTxFail from '@app/modules/charts/components/history/ChartTxFail.vue'
import ChartTxSuccess from '@app/modules/charts/components/history/ChartTxSuccess.vue'
import ChartTxFees from '@app/modules/charts/components/history/ChartTxFees.vue'
import ChartUnclesNumber from '@app/modules/charts/components/history/ChartUnclesNumber.vue'
import { Vue, Component } from 'vue-property-decorator'
import { ChartTypes } from '@app/modules/charts/helpers'

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
    ChartTxFees,
    ChartUnclesNumber
  }
})
export default class PageDetailsChart extends Vue {
  ChartType = ChartTypes

  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.charts'),
        disabled: false,
        link: '/charts'
      },
      {
        text: this.$i18n.t('charts.' + this.chartId),
        disabled: true
      }
    ]
  }

  get chartId() {
    return this.$route.params.chartRef
  }
}
</script>
