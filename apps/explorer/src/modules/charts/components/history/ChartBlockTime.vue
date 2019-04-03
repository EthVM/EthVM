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

/* Time Variables: */

@Component({
  components: {
    Chart
  }
})
export default class ChartBlockTime extends Mixins(ChartMixin) {
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
    return this.$api.getAverageBlockTimeStats(duration)
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get title() {
    return this.$i18n.t('charts.block-time.title').toString()
  }

  get labelString(): string {
    return this.$i18n.t('charts.block-time.description').toString()
  }
}
</script>
