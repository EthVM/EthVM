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
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import { Events } from 'ethvm-common'
import id from '@app/modules/charts/helpers'

/* Time Variables: */
const DES = {
  BEGIN: 'Average block difficulty history in Ethereum blockchain since the begining.',
  OTHER: 'Average block difficulty history in Ethereum blockchain in last '
}

@Component({
  components: {
    AppChart
  }
})
export default class ChartBlockDiff extends Vue {
  ID = id.difficulty
  title = 'Average Block Difficulty'
  redraw = true
  timeFrame = 1
  chartOptions = {
    title: {
      text: 'Average Block Difficulty',
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
            labelString: 'Average Block Difficulty'
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
  DATA = [
    { state: 'ALL', points: [], labels: [] },
    {
      state: 'DAY',
      points: [],
      labels: []
    },
    {
      state: 'MONTH',
      points: [],
      labels: []
    },
    {
      state: 'YEAR',
      points: [],
      labels: []
    }
  ]

  /*Computed: */
  get chartData() {
    return {
      labels: this.DATA[this.timeFrame].labels,
      datasets: [
        {
          label: 'Average Block Difficulty',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: this.DATA[this.timeFrame].points,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  get description(): string {
    return this.timeFrame === 0 ? DES.BEGIN : DES.OTHER + this.DATA[this.timeFrame].state
  }

  /*Methods: */
  setTimeFrame(_value: number): void {
    this.timeFrame = _value
    if (this.DATA[this.timeFrame].points) {
      this.setData(_value)
    }
  }

  setData(_state: number): void {
    this.$socket.emit(Events.getAverageTotalDifficultyStats, { duration: this.DATA[_state].state }, (err, result) => {
      if (!err && result) {
        result.forEach(point => {
          this.DATA[_state].points.push({
            x: point.date,
            y: point.value
          })
          this.DATA[_state].labels.push(point.name)
        })
      }
    })
  }
}
</script>
