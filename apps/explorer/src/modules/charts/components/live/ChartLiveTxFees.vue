<template>
  <chart
    type="line"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    :chart-title="newTitle"
    :chart-description="newDescription"
    unfilled="true"
    :footnotes="footnote"
    :live-chart="true"
  />
</template>

<script lang="ts">
import { Events, BlockMetrics } from 'ethvm-common'
import Chart from '@app/modules/charts/components/Chart.vue'
import ethUnits from 'ethereumjs-units'
import { Vue, Component } from 'vue-property-decorator'
import { EthValue } from '@app/core/models'
import { Footnote } from '@app/core/components/props'

const MAX_ITEMS = 10

class ChartData {
  labels: string[] = []
  avgFees: number[] = []
  avgPrice: number[] = []
}

@Component({
  components: {
    Chart
  }
})
export default class ChartLiveTxFees extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  redraw = true
  data = new ChartData()

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
      this.data.avgFees.push(new EthValue(bm.avgTxFees).toEth())
      this.data.avgPrice.push(new EthValue(bm.avgGasPrice).toGWei())
      if (this.data.labels.length > MAX_ITEMS) {
        this.data.labels.shift()
        this.data.avgFees.shift()
        this.data.avgPrice.shift()
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
          label: this.$i18n.tc('tx.fee', 2),
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: this.data.avgFees,
          yAxisID: 'y-axis-1',
          fill: false
        },
        {
          label: this.$i18n.t('gas.price'),
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: this.data.avgPrice,
          yAxisID: 'y-axis-2',
          fill: false
        }
      ]
    }
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.tx-costs.title'),
        lineHeight: 1
      },
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
              labelString: this.$i18n.tc('tx.fee', 2)
            }
          },
          {
            id: 'y-axis-2',
            position: 'right',
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
              labelString: this.$i18n.t('gas.price')
            }
          }
        ],
        xAxes: [
          {
            display: false
          }
        ]
      },
      scaleShowLabels: false
    }
  }

  get newTitle() {
    return this.$i18n.t('charts.tx-costs.title')
  }

  get newDescription() {
    return this.$i18n.t('charts.tx-costs.description')
  }

  get footnote(): Footnote[] {
    return [
      {
        color: 'txSuccess',
        text: this.$i18n.tc('tx.fee', 2) + ' (' + this.$t('common.eth') + ')',
        icon: 'fa fa-circle'
      },
      {
        color: 'txPen',
        text: this.$i18n.t('gas.price') + ' (' + this.$t('common.gwei') + ')',
        icon: 'fa fa-circle'
      }
    ]
  }
}
</script>
