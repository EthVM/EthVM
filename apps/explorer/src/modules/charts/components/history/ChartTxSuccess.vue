<template>
  <app-chart
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
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { ChartMixin } from '@app/modules/charts/mixins'
import { Component, Mixins } from 'vue-property-decorator'
import { Events } from 'ethvm-common'

@Component({
  components: {
    AppChart
  }
})
export default class ChartTxSuccess extends Mixins(ChartMixin) {
  labelString = 'Successful Transactions'
  newEvent = Events.getSuccessfulTxStats

  // Lifecycle
  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }

  // Computed
  get title() {
    return this.$i18n.t('charts.txSuccess').toString()
  }
}
</script>
