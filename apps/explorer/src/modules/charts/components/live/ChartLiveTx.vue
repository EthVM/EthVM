<template>
  <app-chart
    type="bar"
    :data="chartData"
    :options="chartOptions"
    :chart-title="newTitle"
    :chart-description="newDescription"
    :redraw="redraw"
    :footnote-arr="footnote"
    :live-chart="true"
  />
</template>

<script lang="ts">
import { Events, BlockMetrics } from 'ethvm-common'
import BN from 'bignumber.js'
import AppChart from '@app/modules/charts/components/AppChart.vue'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppChart
  }
})
export default class ChartLiveTransactions extends Vue {
  redraw = true
  data = {
    labels: [],
    sTxs: [],
    fTxs: [],
    pTxs: []
  }

  // Lifecycle
  created() {
    this.fillChartData(this.$store.getters.blockMetrics.slice(0, MAX_ITEMS))
  }

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK_METRIC, (bm: BlockMetrics[] | BlockMetrics) => {
      this.redraw = false
      this.fillChartData(bm)
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.NEW_BLOCK_METRIC)
  }

  // Methods
  fillChartData(bms: BlockMetrics[] | BlockMetrics = []) {
    bms = !Array.isArray(bms) ? [bms] : bms
    bms.forEach(bm => {
      this.data.labels.push(bm.number)
      this.data.sTxs.push(bm.numSuccessfulTxs)
      this.data.fTxs.push(bm.numFailedTxs)
      this.data.pTxs.push(bm.numPendingTxs)
      if (this.data.labels.length > MAX_ITEMS) {
        this.data.labels.pop()
        this.data.sTxs.pop()
        this.data.fTxs.pop()
        this.data.pTxs.pop()
      }
    })
  }

  // Computed
  get chartData() {
    return {
      labels: this.data.labels,
      datasets: [
        {
          label: 'Pending',
          backgroundColor: '#eea66b',
          borderColor: '#eea66b',
          data: this.data.pTxs,
          type: 'line',
          fill: false,
          yAxisID: 'y-axis-2'
        },
        {
          label: this.$i18n.t('footnote.success'),
          backgroundColor: '#40ce9c',
          data: this.data.sTxs,
          yAxisID: 'y-axis-1'
        },
        {
          label: this.$i18n.t('footnote.failed'),
          backgroundColor: '#fe136c',
          data: this.data.fTxs,
          yAxisID: 'y-axis-1'
        }
      ]
    }
  }

  get footnote() {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('footnote.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('footnote.failed'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txPen',
        text: this.$i18n.t('footnote.pending'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get newTitle() {
    return this.$i18n.t('charts.txSummary')
  }

  get newDescription() {
    return this.$i18n.t('charts.liveDescription')
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.title')
      },
      responsive: true,
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            stacked: false,
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
              labelString: this.$i18n.t('charts.sfTxsLabel')
            }
          },
          {
            id: 'y-axis-2',
            position: 'right',
            stacked: false,
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
              labelString: this.$i18n.t('charts.penTxsLabel')
            }
          }
        ],
        xAxes: [
          {
            stacked: false,
            display: false,
            categoryPercentage: 0.7
          }
        ]
      }
    }
  }
}
</script>
