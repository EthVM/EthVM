<template>
  <chart
    type="bar"
    :data="chartData"
    :options="chartOptions"
    :chart-title="newTitle"
    :chart-description="newDescription"
    :redraw="redraw"
    :footnotes="footnote"
    :live-chart="true"
  />
</template>

<script lang="ts">
import { Events, BlockMetrics } from 'ethvm-common'
import BN from 'bignumber.js'
import Chart from '@app/modules/charts/components/Chart.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Footnote } from '@app/core/components/props'

const MAX_ITEMS = 10

@Component({
  components: {
    Chart
  }
})
export default class ChartLiveTransactions extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  redraw = true
  data = {
    labels: [],
    sTxs: [],
    fTxs: [],
    pTxs: []
  }

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.fillChartData(this.$store.getters.blockMetrics.items().slice(0, MAX_ITEMS))
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

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fillChartData(bms: BlockMetrics[] | BlockMetrics = []) {
    bms = !Array.isArray(bms) ? [bms] : bms
    const blockN = this.$i18n.t('block.number')
    bms.forEach(bm => {
      this.data.labels.push(blockN + bm.number)
      this.data.sTxs.push(bm.numSuccessfulTxs)
      this.data.fTxs.push(bm.numFailedTxs)
      this.data.pTxs.push(bm.numPendingTxs)
      if (this.data.labels.length > MAX_ITEMS) {
        this.data.labels.shift()
        this.data.sTxs.shift()
        this.data.fTxs.shift()
        this.data.pTxs.shift()
      }
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

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
          label: this.$i18n.t('common.success'),
          backgroundColor: '#40ce9c',
          data: this.data.sTxs,
          yAxisID: 'y-axis-1'
        },
        {
          label: this.$i18n.t('common.fail'),
          backgroundColor: '#fe136c',
          data: this.data.fTxs,
          yAxisID: 'y-axis-1'
        }
      ]
    }
  }

  get footnote(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.t('common.success'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txFail',
        text: this.$i18n.t('common.fail'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txPen',
        text: this.$i18n.t('common.pending'),
        icon: 'fa fa-circle'
      }
    ]
  }

  get newTitle() {
    return this.$i18n.t('charts.tx-summary.title')
  }

  get newDescription() {
    return this.$i18n.t('charts.tx-summary.description')
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.tx-summary.title')
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
              labelString: this.$i18n.t('charts.tx-summary.label.success-fail')
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
              labelString: this.$t('charts.tx-summary.label.pen')
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
