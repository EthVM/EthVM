import { ChartData, ChartPoints } from '@app/modules/charts/props'
import { Component, Vue } from 'vue-property-decorator'

@Component
export class ChartMixin extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  chartTitle = ''
  chartLabel = ''
  chartEvent = ''
  redraw = true
  timeFrame = 1
  chartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          position: 'left',
          id: 'y-axis-1',
          ticks: {
            beginAtZero: true,
            callback: function(value) {
              const ranges = [{ divider: 1e9, suffix: 'B' }, { divider: 1e6, suffix: 'M' }, { divider: 1e3, suffix: 'k' }]
              function formatNumber(n) {
                for (let i = 0; i < ranges.length; i++) {
                  if (n >= ranges[i].divider) {
                    return (n / ranges[i].divider).toString() + ranges[i].suffix
                  }
                }
                return n
              }
              return formatNumber(value)
            }
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)'
          },
          scaleLabel: {
            display: true,
            labelString: this.chartLabel
          }
        }
      ],
      xAxes: [
        {
          type: 'time',
          distribution: 'series',
          ticks: {
            source: 'auto'
          }
        }
      ]
    }
  }

  DATA: ChartPoints[] = [
    { state: 'ALL', points: [], labels: [] },
    { state: 'WEEK', points: [], labels: [] },
    { state: 'MONTH', points: [], labels: [] },
    { state: 'YEAR', points: [], labels: [] }
  ]

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  setTitle(_title: string): void {
    this.chartTitle = _title
  }

  setLabel(_label: string): void {
    this.chartLabel = _label
  }

  setEvent(_event): void {
    this.chartEvent = _event
  }

  setTimeFrame(_value: number): void {
    this.timeFrame = _value
    if (this.DATA[this.timeFrame].points.length === 0) {
      this.setData(_value)
    }
  }

  setData(_state: number): void {
    // this.$socket.emit(this.chartEvent, { duration: this.DATA[_state].state }, (err, result) => {
    //   if (!err && result) {
    //     result.forEach(point => {
    //       this.DATA[_state].points.push(point.value)
    //       this.DATA[_state].labels.push(point.date)
    //     })
    //   }
    // })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get chartData(): ChartData {
    return {
      labels: this.DATA[this.timeFrame].labels,
      datasets: [
        {
          label: this.chartLabel,
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
    return this.timeFrame === 0
      ? this.chartLabel + this.$i18n.t('charts.captions.all')
      : this.chartLabel + this.$i18n.t('charts.captions.other') + this.cap[this.timeFrame]
  }

  get cap(): string[] {
    return [
      this.$i18n.tc('charts.states.all', 1).toString(),
      this.$i18n.tc('charts.states.week', 1).toString(),
      this.$i18n.tc('charts.states.month', 1).toString(),
      this.$i18n.tc('charts.states.year', 1).toString()
    ]
  }
}
