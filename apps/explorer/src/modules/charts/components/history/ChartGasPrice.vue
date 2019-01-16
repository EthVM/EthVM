<template>
  <app-chart
    type="line"
    :chart-id="id"
    :chart-title="title"
    :chart-description="description"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    unfilled="true"
  >
  </app-chart>
</template>

<script lang="ts">
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'

/* Time Variables: */
const STATES = {
  ALL: 'ALL',
  YEAR: 'YEAR',
  MONTH: 'MONTH',
  DAY: 'DAY'
}

const DES = {
  BEGIN: 'Average gas price history in Ethereum blockchain since the begining ',
  OTHER: 'Average gas price history in Ethereum blockchain in last '
}

@Component({
  components: {
    AppChart
  }
})
export default class ChartGasPrice extends Vue {
  id = 'gas_price_history'
  title = 'Average Gas Price History'
  redraw = false
  timeFrame = STATES.DAY
  chartOptions = {
    title: {
      text: 'Average Gas Limit',
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
            labelString: 'Average Gas Limit (wei)'
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

    this.$socket.emit('getAverageGasPrice', this.timeFrame, (err, result) => {
      if (!err && result) {
        result.forEach(function(block) {
          newPoints.push(block.reduction)
          newLabels.push(block.group)
        })
      }
    })
    return {
      labels: newLabels,
      datasets: [
        {
          label: 'Average Gas Price (GWEI',
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
    return this.timeFrame === STATES.ALL ? DES.BEGIN : DES.OTHER + this.timeFrame
  }
}
</script>
