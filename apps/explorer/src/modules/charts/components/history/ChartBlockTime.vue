<template>
  <app-chart
    type="line"
    :chart-id="ID"
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
import { Vue, Component, Mixins } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import { Events } from 'ethvm-common'

/* Time Variables: */

@Component({
  components: {
    AppChart
  }
})
export default class ChartGasPrice extends Mixins(ChartMixin) {
  title = 'Average Block Time history'
  labelString = 'Average Block time (sec)'
  //Temp Event String
  newEvent = Events.getAverageBlockTimeStats

  created() {
    this.setTitle(this.title)
    this.setLabel(this.labelString)
    this.setEvent(this.newEvent)
  }
}
</script>

