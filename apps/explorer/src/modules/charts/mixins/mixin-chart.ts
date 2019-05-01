import { ChartData, ChartPoints } from '@app/modules/charts/props'
import { EthValue } from '@app/core/models'
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

  redraw = true
  timeFrame = 1

  chartOptions = {
    responsive: true,
    maintainAspectRatio: this.getRatio,
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
            display: false,
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

  data: ChartPoints[] = [
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

  setTitle(title: string): void {
    this.chartTitle = title
  }

  setLabel(label: string): void {
    this.chartLabel = label
  }

  setTimeFrame(value: number): void {
    this.timeFrame = value
    if (this.data[this.timeFrame].points.length === 0) {
      this.setData(value)
    }
  }

  setData(state: number): void {
    const duration = this.data[state].state.toUpperCase()
    this.fetchData(duration).then(res => {
      res = res.map(r => {
        r.date = new Date(+r.date)
        return r
      })

      if (res) {
        if (this.chartTitle === this.$i18n.t('charts.gas-price.title ').toString()) {
          res.forEach(point => {
            this.data[state].points.push(new EthValue(point.value).toGWei())
            this.data[state].labels.push(point.date)
          })
        } else if (this.chartTitle === this.$i18n.t('charts.tx-fees.title').toString()) {
          res.forEach(point => {
            this.data[state].points.push(new EthValue(point.value).toEth())
            this.data[state].labels.push(point.date)
          })
        } else {
          res.forEach(point => {
            this.data[state].points.push(point.value)
            this.data[state].labels.push(point.date)
          })
        }
      }
    })
  }

  // Method intended to be overriden by implementors
  fetchData(duration: string): Promise<any[]> {
    return Promise.resolve([])
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get getRatio(): boolean {
    const brkPoint = this.$vuetify.breakpoint.name
    return brkPoint === 'xs' ? false : true
  }
  get chartData(): ChartData {
    return {
      labels: this.data[this.timeFrame].labels,
      datasets: [
        {
          label: this.chartLabel,
          borderColor: '#20c0c7',
          backgroundColor: '#20c0c7',
          data: this.data[this.timeFrame].points,
          yAxisID: 'y-axis-1',
          fill: false
        }
      ]
    }
  }

  get description(): string {
    return this.timeFrame === 0
      ? `${this.chartLabel} ${this.$i18n.t('charts.captions.all')}`
      : `${this.chartLabel} ${this.$i18n.t('charts.captions.other')} ${this.cap[this.timeFrame]}`
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
