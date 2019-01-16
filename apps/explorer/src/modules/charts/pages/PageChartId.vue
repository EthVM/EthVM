<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs"></app-bread-crumbs>
    <chart-block-diff v-if="chartID === 'block_difficulty_history'"/>
    <chart-block-time v-if="chartID === 'block_time_history'"/>
    <chart-block-size v-if="chartID === 'block_size_history'"/>
    <chart-gas-limit v-if="chartID === 'gas_limit_history'"/>
    <chart-gas-price v-if="chartID === 'gas_price_history'"/>
    <chart-hash-rate v-if="chartID === 'hash_rate_history'"/>
    <chart-mining-reward v-if="chartID === 'miner_rewards_history'"/>
    <chart-top-miners v-if="chartID === 'top_miners_history'"/>
    <chart-tx-fail v-if="chartID === 'tx_fail_history'"/>
    <chart-tx-success v-if="chartID === 'tx_success_history'"/>
    <chart-tx-fees v-if="chartID === 'tx_fees_history'"/>
    <chart-uncles-number v-if="chartID === 'uncle_number_history'"/>
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
export default class PageChartId extends Vue {

  get crumbs() {
    return  [
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
