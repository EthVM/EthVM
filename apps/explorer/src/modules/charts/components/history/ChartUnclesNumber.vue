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
export default class ChartUnclesNumber extends Mixins(ChartMixin) {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  // This event is waiting for emplementations, right now this is a temp event to avoid errors
  newEvent = Events.getSuccessfulTxStats

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
  get title(): string {
    return this.$i18n.t('charts.uncles-number.title').toString()
  }

  get labelString(): string {
    return this.$i18n.t('charts.uncle-number.description').toString()
  }
}
</script>
