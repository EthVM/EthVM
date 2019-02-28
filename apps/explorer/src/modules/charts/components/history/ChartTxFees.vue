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
import { Events } from 'ethvm-common'

@Component({
  components: {
    Chart
  }
})
export default class ChartTxFees extends Mixins(ChartMixin) {
  newEvent = Events.getAverageTxFeeStats

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get title() {
    return this.$i18n.t('charts.txFees').toString()
  }

  get labelString(): string {
    return this.$i18n.t('charts.tx-fees-history').toString()
  }
}
</script>
