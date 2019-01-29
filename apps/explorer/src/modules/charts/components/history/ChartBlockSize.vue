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
  >
  </app-chart>
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
export default class ChartBlockSize extends Mixins(ChartMixin) {
  /* Temp Event - Waiting for the event to be implemented, approximate release after 1.01 */
  newEvent = Events.getAverageDifficultyStats

  // Lifecycle
  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }

  // Computed
  get title(): string {
    return this.$i18n.t('charts.avgBlockSize').toString()
  }
  get labelString(): string {
    return this.$i18n.t('charts.block-size-history').toString()
  }
}
</script>
