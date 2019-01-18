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
    @timeFrame = "setTimeFrame"
  />
</template>

<script lang="ts">
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { Vue, Component } from 'vue-property-decorator'
import ethUnits from 'ethereumjs-units'
import { Events } from 'ethvm-common'

/* Time Variables: */

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
  redraw = true
  timeFrame = 1
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
  DATA = [
  { state: "ALL",
    points: [],
    labels: []
  }, {
    state: "DAY",
    points: [],
    labels: []
  },{
    state: "MONTH",
    points: [],
    labels: []
  }, {
    state: "YEAR",
    points: [],
    labels: []
  } ]


  /*Computed: */
  get chartData() {
    return {
      labels: this.DATA[this.timeFrame].labels,
      datasets: [
        {
          label: 'Average Gas Price (GWEI)',
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: this.DATA[this.timeFrame].points,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }
   /*Methods: */
  setTimeFrame(_value: number): void {
    this.timeFrame = _value
    if(this.DATA[this.timeFrame].points) {
      this.setData(_value)
    }
  }

  setData(_state: number): void {
    this.$socket.emit( Events.getAverageGasPriceStats, {"duration": this.DATA[_state].state }, (err, result) => {
      console.log("error in data request: "+ _state, err)
      console.log("result in data request: "+_state, result)
      if (!err && result) {
        result.forEach(point =>{
          this.DATA[_state].points.push({
            x: point.date,
            y: point.value})
          this.DATA[_state].labels.push('label')
        })
      }
    })
  }
  get description(): string {
    return this.timeFrame === 0? DES.BEGIN : DES.OTHER + this.DATA[this.timeFrame].state
  }
}
</script>
