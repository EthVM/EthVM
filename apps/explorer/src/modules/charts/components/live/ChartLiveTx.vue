<template>
  <v-layout column justify-center>
    <app-chart
      type="bar"
      :data="chartData"
      :options="chartOptions"
      :chart-title="newTitle"
      :chart-description="newDescription"
      :redraw="redraw"
      :footnote-arr="footnote"
      :live-chart="true"
    ></app-chart>
  </v-layout>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
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
  data() {
    return {
      chartData: {},
      chartOptions: {
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
                beginAtZero: true
              },
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              scaleLabel: {
                display: true,
                labelString: this.$i18n.t('charts.labelString')
              }
            },
            {
              id: 'y-axis-2',
              position: 'right',
              stacked: false,
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                color: 'rgba(0, 0, 0, 0)'
              },
              scaleLabel: {
                display: true,
                labelString: 'Pending Tx'
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
        },

        barShowLabels: true
      },
      redraw: false,
      newTitle: this.$i18n.t('charts.txSummary'),
      newDescription: this.$i18n.t('charts.liveDescription'),
      footnote: [
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
        const _tempD = _block.getStats()
        this.chartData.labels.push(_block.getNumber())
        this.chartData.labels.shift()
        this.chartData.datasets[0].data.push(0) //pending tx ev
        this.chartData.datasets[0].data.shift()
        this.chartData.datasets[1].data.push(_tempD.successfulTxs)
        this.chartData.datasets[1].data.shift()
        this.chartData.datasets[2].data.push(_tempD.failedTxs)
        this.chartData.datasets[2].data.shift()
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
      sData: [],
      fData: [],
      pData: []
    }

    const latestBlocks = this.$store.getters.blocks.slice(0, MAX_ITEMS)
    latestBlocks.forEach(_block => {
      data.labels.unshift(_block.getNumber())
      const _tempD = _block.getStats()
      data.sData.unshift(new BN(_tempD.successfulTxs).toNumber())
      data.fData.unshift(new BN(_tempD.failedTxs).toNumber())
      data.pData.unshift(new BN(0).toNumber()) //pending tx ev
    })

    return {
      labels: data.labels,
      datasets: [
        {
          label: 'Pending',
          backgroundColor: '#eea66b',
          borderColor: '#eea66b',
          data: data.pData,
          type: 'line',
          fill: false,
          yAxisID: 'y-axis-2'
        },
        {
          label: this.$i18n.t('footnote.success'),
          backgroundColor: '#40ce9c',
          data: data.sData,
          yAxisID: 'y-axis-1'
        },
        {
          label: this.$i18n.t('footnote.failed'),
          backgroundColor: '#fe136c',
          data: data.fData,
          yAxisID: 'y-axis-1'
        }
      ]
    }
  }
}
</script>
