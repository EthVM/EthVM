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

/* Time Variables: */

@Component({
  components: {
    AppChart
  }
})
export default class ChartGasPrice extends Mixins(ChartMixin) {
  title = 'Average Hash Rate History'
  labelString = 'Average Hash Rate'
  newEvent = Events.getAverageGasPriceStats

  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }
}
</script>
