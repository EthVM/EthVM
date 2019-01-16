<template>
  <app-chart type="doughnut" :chart-id="id" :chart-title="title" :chart-description="description" :data="chartData" :options="chartOptions" :redraw="redraw" unfilled="true">
  </app-chart>
</template>

<script lang="ts">
  import AppChart from '@app/modules/charts/components/AppChart.vue'
  import {
    Vue,
    Component
  } from 'vue-property-decorator'
  import ethUnits from 'ethereumjs-units'

  /* Time Variables: */
  const STATES = {
    ALL: 'ALL',
    YEAR: 'YEAR',
    MONTH: 'MONTH',
    DAY: 'DAY'
  }

  const DES = {
    BEGIN: 'Top Miners history in Ethereum blockchain since the begining.',
    OTHER: 'Top Miners history  in Ethereum blockchain in last '
  }

  @Component({
    components: {
      AppChart
    }
  })

  export default class ChartBlockSize extends Vue {
    id = "top_miners_history"
    title = "Top Miners"
    redraw = false
    timeFrame = STATES.DAY
    chartOptions = {
      title: {
        text: 'Top Miners',
        lineHeight: 1
      },
      responsive: true,
      legend: {
        display: true,
        position: 'left'
      },
      cutoutPercentage: 40
    }
    /*Computed: */
    get chartData() {
      const newLabels = []
      const newPoints = []

      this.$socket.emit('getTopMiners', this.timeFrame, (err, result) => {
        if (!err && result) {
          result.forEach(function(block) {
            newPoints.push(block.reduction)
            newLabels.push(block.group)
          })
        }
      })
      return {
        labels: newLabels,
        datasets: [{
          label: 'Average Miner Rewards',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: newPoints,
          yAxisID: 'y-axis-1',
          fill: false
        }]
      }
    }
    get description(): string {
      return (this.timeFrame === STATES.ALL) ? DES.BEGIN : DES.OTHER + this.timeFrame
    }
  }
</script>
