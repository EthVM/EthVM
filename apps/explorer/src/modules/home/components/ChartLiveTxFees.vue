<template>
  <v-layout column justify-center>
    <app-chart
      type="line"
      :data="chartData"
      :options="chartOptions"
      :redraw="redraw"
      :chart-title="newTitle"
      :chart-description="newDescription"
      unfilled="true"
      :footnote-arr="footnote"
    ></app-chart>
  </v-layout>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import AppChart from '@app/core/components/ui/AppChart.vue'
import ethUnits from 'ethereumjs-units'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
  components: {
    AppChart
  }
})
export default class ChartLiveTxFees extends Vue {
  data() {
    return {
      chartData: {},
      chartOptions: {
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
                beginAtZero: true
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
                beginAtZero: true
              },
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              scaleLabel: {
                display: true,
                labelString: this.$i18n.t('charts.gasPrice')
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
      },
      redraw: false,
      newTitle: this.$i18n.t('charts.avgTxCost'),
      newDescription: this.$i18n.t('charts.avgDescription'),
      footnote: [
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

  // Lifecycle
  created() {
    this.chartData = this.initData
    this.$eventHub.$on(Events.pastBlocksR, () => {
      this.chartData = this.initData
      this.redraw = true
    })
    this.$eventHub.$on(Events.newBlock, _block => {
      if (this.chartData.datasets[0]) {
        this.redraw = false
        if (!_block.getIsUncle()) {
          const _tempD = _block.getStats()
          this.chartData.labels.push(_block.getNumber())
          this.chartData.labels.shift()
          this.chartData.datasets[0].data.push(ethUnits.convert(_tempD.avgTxsFees, 'wei', 'eth'))
          this.chartData.datasets[0].data.shift()
          this.chartData.datasets[1].data.push(ethUnits.convert(_tempD.avgGasPrice, 'wei', 'gwei'))
          this.chartData.datasets[1].data.shift()
        }
      }
    })
  }

  beforeDestroy() {
    this.$eventHub.$off(Events.pastBlocksR)
    this.$eventHub.$off(Events.newBlock)
  }

  // Computed
  get initData() {
    const data = {
      labels: [],
      avgFees: [],
      avgPrice: []
    }
    const latestBlocks = this.$store.getters.blocks.slice(0, MAX_ITEMS)
    latestBlocks.forEach(_block => {
      data.labels.unshift(_block.getNumber())
      const _tempD = _block.getStats()
      data.avgFees.unshift(ethUnits.convert(_tempD.avgTxsFees, 'wei', 'eth'))
      data.avgPrice.unshift(ethUnits.convert(_tempD.avgGasPrice, 'wei', 'gwei'))
    })
    return {
      labels: data.labels,
      datasets: [
        {
          label: this.$i18n.t('footnote.aveTxFees'),
          borderColor: '#40ce9c',
          backgroundColor: '#40ce9c',
          data: data.avgFees,
          yAxisID: 'y-axis-1',
          fill: false
        },
        {
          label: this.$i18n.t('footnote.aveGasPrice'),
          borderColor: '#eea66b',
          backgroundColor: '#eea56b',
          data: data.avgPrice,
          yAxisID: 'y-axis-2',
          fill: false
        }
      ]
    }
  }
}
</script>
