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
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import id from '@app/modules/charts/helpers'
import { Events } from 'ethvm-common'

/* Time Variables: */
const STATES = ['ALL', 'YEAR', 'MONTH', 'DAY']

const DES = {
  BEGIN: 'Average block time history in Ethereum blockchain since the begining.',
  OTHER: 'Average block time history in Ethereum blockchain in last '
}

@Component({
  components: {
    AppChart
  }
})
export default class ChartBlockSize extends Vue {
  ID = id.blockTime
  title = 'Average Block Time'
  redraw = false
  timeFrame = 1
  chartOptions = {
    title: {
      text: 'Average Block Time',
      lineHeight: 1
    },
    responsive: true,
    scales: {
      yAxes: [
        {
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            beginAtZero: true
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          },
          scaleLabel: {
            display: true,
            labelString: 'Average Block Time'
          }
        }
      ],
      xAxes: [
        {
          type: 'time',
          distribution: 'series',
          ticks: {
            source: 'labels'
          }
        }
      ]
    }
  }

  /*Computed: */
  get chartData() {
    const newLabels = []
    const newPoints = []
    this.$socket.emit(Events.getAverageBlockTimeStats, STATES[this.timeFrame], (err, result) => {
      if (!err && result) {
        result.forEach(block => {
          newPoints.push(block.reduction)
          newLabels.push(block.group)
        })
      }
    })
    return {
      labels: newLabels,
      datasets: [
        {
          label: 'Average Block Time',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: newPoints,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  get description(): string {
    return this.timeFrame === 0 ? DES.BEGIN : DES.OTHER + STATES[this.timeFrame]
  }

  /*Methods: */
  setTimeFrame(_value: number): void {
    this.timeFrame = _value
  }
}
</script>
