<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <chart-block-diff v-if="chartID === ID.difficulty" />
    <chart-block-time v-if="chartID === ID.blockTime" />
    <chart-block-size v-if="chartID === ID.blockSize" />
    <chart-gas-limit v-if="chartID === ID.gasLimit" />
    <chart-gas-price v-if="chartID === ID.gasPrice" />
    <chart-hash-rate v-if="chartID === ID.hashRate" />
    <chart-mining-reward v-if="chartID === ID.minerReward" />
    <chart-top-miners v-if="chartID === ID.topMiners" />
    <chart-tx-fail v-if="chartID === ID.txFail" />
    <chart-tx-success v-if="chartID === ID.txSuccess" />
    <chart-tx-fees v-if="chartID === ID.txFees" />
    <chart-uncles-number v-if="chartID === ID.uncles" />
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
import id from '@app/modules/charts/helpers'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    ChartBlockDiff,
    ChartBlockTime,
    ChartGasLimit,
    ChartGasPrice,
    ChartHashRate,
    ChartMiningReward,
    ChartTopMiners,
    ChartTxFail,
    ChartTxSuccess,
    ChartTxFees,
    ChartUnclesNumber
  }
})
export default class PageChartID extends Vue {
  ID = id
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.charts'),
        disabled: false,
        link: '/charts'
      },
      {
        text: this.chartID,
        disabled: true
      }
    ]
  }
  get chartID() {
    return this.$route.params.chartID
  }
}
</script>
