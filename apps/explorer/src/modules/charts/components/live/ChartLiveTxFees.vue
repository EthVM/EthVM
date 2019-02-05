<template>
  <app-chart
    type="line"
    :data="chartData"
    :options="chartOptions"
    :redraw="redraw"
    :chart-title="newTitle"
    :chart-description="newDescription"
    unfilled="true"
    :footnote-arr="footnote"
    :live-chart="true"
  />
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import AppChart from '@app/modules/charts/components/AppChart.vue'
import ethUnits from 'ethereumjs-units'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppChart
  }
})
export default class ChartLiveTxFees extends Vue {
  redraw = true
  DATA = {
    labels: [],
    avgFees: [],
    avgPrice: []
  }

  // Lifecycle

  created() {
    this.getPastData(MAX_ITEMS)
  }

  mounted() {
    this.$eventHub.$on(Events.NEW_BLOCK, _block => {
      this.redraw = false
      const lastBlock = 1
      this.getPastData(lastBlock)
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.NEW_BLOCK)
  }

  // Methods

  getPastData(_items: number): void {
    this.$socket.emit(Events.getBlockMetrics, { limit: _items, page: 0 }, (err, result) => {
      if (!err && result) {
        result.forEach(_block => {
          this.DATA.labels.push('block_number')
          this.DATA.avgFees.push(_block.avgTxFees)
          this.DATA.avgPrice.push(_block.avgGasPrice)
        })
        if (this.DATA.labels.length > MAX_ITEMS) {
          this.DATA.labels.pop()
          this.DATA.avgFees.pop()
          this.DATA.avgPrice.pop()
        }
      }
    })
  }

  setTicks() {}

  // Computed
  get chartData() {
    return {
      labels: this.DATA.labels,
      datasets: [
        {
          label: this.$i18n.t('footnote.aveTxFees'),
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: this.DATA.avgFees,
          yAxisID: 'y-axis-1',
          fill: false
        },
        {
          label: this.$i18n.t('footnote.aveGasPrice'),
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: this.DATA.avgPrice,
          yAxisID: 'y-axis-2',
          fill: false
        }
      ]
    }
  }

  get chartOptions() {
    return {
      title: {
        text: this.$i18n.t('charts.avgTitle'),
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
              labelString: this.$i18n.t('charts.txFees')
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
              labelString: this.$i18n.t('charts.avgGasPrice')
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
    return this.$i18n.t('charts.avgTxCost')
  }

  get newDescription() {
    return this.$i18n.t('charts.avgDescription')
  }

  get footnote() {
    return [
      {
        color: 'txFail',
        text: this.$i18n.t('footnote.aveTxFees'),
        icon: 'fa fa-circle'
      },
      {
        color: 'txPen',
        text: this.$i18n.t('footnote.aveGasPrice'),
        icon: 'fa fa-circle'
      }
    ]
  }
}
</script>
