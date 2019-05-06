<template>
  <chart
    type="line"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    unfilled="true"
    @timeFrame="setTimeFrame"
  />
</template>

<script lang="ts">
import Chart from '@app/modules/charts/components/Chart.vue'
import { ChartMixin } from '@app/modules/charts/mixins'
import { Component, Mixins } from 'vue-property-decorator'
import { avgGasPriceHistory } from '@app/modules/charts/components/history/timeseries.graphql'
import {avgGasPrice_aggregateBlockMetrics} from '@app/core/api/apollo/types/avgGasPrice';
import {Statistic} from '@app/core/models';
import BigNumber from 'bignumber.js';

@Component({
  components: {
    Chart
  },
  apollo: {
    metricsPage: {

      query: avgGasPriceHistory,

      update: ({ aggregateBlockMetrics }) => {
        return aggregateBlockMetrics
      }

    }
  }
})
export default class ChartGasPrice extends Mixins(ChartMixin) {

  metricsPage?: avgGasPrice_aggregateBlockMetrics

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fetchData(duration: string): Promise<any[]> {
    return this.$api.getAverageGasPriceStats(duration)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get data(): Statistic[] {

    if(!this.metricsPage) return []

    const { items } = this.metricsPage

    return items!.map( item => {
      const { timestamp, avgGasPrice } = item!
      return {
        date: timestamp,
        value: new BigNumber(avgGasPrice, 16).toNumber()
      } as Statistic
    })

  }

  get title(): string {
    return this.$i18n.t('charts.gas-price.title').toString()
  }

  get labelString(): string {
    return this.$i18n.t('charts.gas-price.description').toString()
  }
}
</script>
