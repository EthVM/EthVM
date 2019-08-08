<template>
  <v-card color="white" flat class="mb-3 pa-1">
    <v-layout align-center row wrap mb-0>
      <v-flex grow pa-0>
        <v-card-title class="title font-weight-bold pb-0">{{ chartTitle }}</v-card-title>
        <v-layout align-center justify-start row fill-height pr-2 pl-2>
        <v-card-text class="info--text caption">{{ chartDescription }}</v-card-text>
        </v-layout>
      </v-flex>
      <v-flex grow v-if="!liveChart">
        <v-layout row wrap align-center justify-end pa-3>
          <button flat :class="[this.toggleData === 0 ? 'active-button' : 'button']" @click="toggleData = 0" small>{{ $tc('charts.states.day', 2) }}</button>
          <button flat :class="[this.toggleData === 1 ? 'active-button' : 'button']" @click="toggleData = 1" small>{{ $tc('charts.states.week', 2) }}</button>
          <button flat :class="[this.toggleData === 2 ? 'active-button' : 'button']" @click="toggleData = 2" small>
            {{ $tc('charts.states.week-two', 2) }}
          </button>
          <button flat :class="[this.toggleData === 3 ? 'active-button' : 'button']" @click="toggleData = 3" small>{{ $tc('charts.states.month', 2) }}</button>
          <button flat :class="[this.toggleData === 4 ? 'active-button' : 'button']" @click="toggleData = 4" small>
            {{ $tc('charts.states.month-three', 2) }}
          </button>
          <button flat :class="[this.toggleData === 5 ? 'active-button' : 'button']" @click="toggleData = 5" small>
            {{ $tc('charts.states.month-six', 2) }}
          </button>
          <button flat :class="[this.toggleData === 6 ? 'active-button' : 'button']" @click="toggleData = 6" small>{{ $tc('charts.states.year', 2) }}</button>
          <button flat :class="[this.toggleData === 7 ? 'active-button' : 'button']" @click="toggleData = 7" small>{{ $tc('charts.states.all', 2) }}</button>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout align-center justify-end row fill-height v-if="footnotes" pb-3 pt-2> <app-footnotes :footnotes="footnotes" /> </v-layout>
    <app-info-load v-show="dataLoading" />
    <div v-show="!(dataLoading || hasError)">
      <canvas v-if="!liveChart" ref="chart" :class="chartClass" />
      <canvas v-else ref="chart" />
    </div>
    <app-error :has-error="hasError" :message="error" class="mb-4" />
  </v-card>
</template>

<script lang="ts">
import ChartJs from 'chart.js'
import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import { Footnote } from '@app/core/components/props'
import { ChartConfig, ChartData } from '@app/modules/charts/props'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import AppError from '@app/core/components/ui/AppError.vue'

ChartJs.defaults.global = Object.assign(ChartJs.defaults.global, {
  defaultFontFamily: "'Open Sans', 'sans-serif'",
  defaultFontStyle: '200'
})

ChartJs.defaults.global.title = Object.assign(ChartJs.defaults.global.title, {
  display: false
})

ChartJs.defaults.global.tooltips = Object.assign(ChartJs.defaults.global.tooltips, {
  titleFontStyle: '400',
  backgroundColor: '#686868',
  mode: 'index',
  intersect: false
})

ChartJs.defaults.global.legend = Object.assign(ChartJs.defaults.global.legend, {
  display: false
})

ChartJs.defaults.global.layout = Object.assign(ChartJs.defaults.global.layout, {
  padding: {
    top: 20,
    bottom: 10
  }
})

ChartJs.defaults.global.elements.point = Object.assign(ChartJs.defaults.global.elements.point, {
  hoverRadius: 6,
  borderWidth: 1,
  radius: 2
})

ChartJs.defaults.doughnut.animation = Object.assign(ChartJs.defaults.doughnut.animation, {
  animateRotate: true
})

@Component({
  components: {
    AppFootnotes,
    AppInfoLoad,
    AppError
  }
})
export default class AppChart extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: Boolean, default: false }) liveChart!: boolean
  @Prop({ type: String, required: true }) type!: string
  @Prop({ type: Object, required: true }) config!: ChartConfig
  @Prop({ type: Array, required: true }) initialData!: ChartData[]
  @Prop({ type: Boolean }) redraw!: boolean
  @Prop({ type: Object }) options!: object
  @Prop({ type: String }) chartTitle!: string
  @Prop({ type: String }) chartDescription!: string
  @Prop({ type: Array }) footnotes?: Footnote[]
  @Prop({ type: Boolean }) dataLoading?: boolean
  @Prop({ type: String }) error!: string
  @Prop({ type: Number, default: 10 }) maxItems!: number
  @Prop({ type: Object }) newData!: ChartData
  @Prop({ type: String, default: 'leftToRight' }) direction!: 'leftToRight' | 'rightToLeft'

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  toggleData = 0
  chart: ChartJs | null = null

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    if (!this.liveChart) {
      this.$emit('timeFrame', this.toggleData)
    }
  }

  mounted() {
    if (this.config && this.initialData && this.initialData.length) {
      this.createChart()
    }
  }

  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
  /*
  ===================================================================================
    Computed
  ===================================================================================
  */
  get chartClass(): string {
    const brkPoint = this.$vuetify.breakpoint.name
    switch (brkPoint) {
      case 'xs':
        return 'xs-chart'
      default:
        return ''
    }
  }

  get hasError(): boolean {
    return this.error !== ''
  }
  /*
  ===================================================================================
    Watch Events
  ===================================================================================
  */

  @Watch('initialData')
  onInitialDataChanged(): void {
    if (this.redraw) {
      if (this.chart) {
        this.chart.destroy()
      }
      this.createChart()
    } else if (!this.chart && this.config && this.initialData && this.initialData.length) {
      this.createChart() // Create chart if not created in mounted hook
    }
  }

  @Watch('toggleData')
  onTogleDataChanged(newVal: number, oldVal: number): void {
    this.$emit('timeFrame', newVal)
  }

  @Watch('newData')
  onNewItem(newData: ChartData): void {
    if (!newData) {
      return
    }

    if (this.redraw) {
      this.updateInitialData(newData)
      this.redrawChart()
    } else {
      this.updateChartData(newData)
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  createChart() {
    const { config, initialData } = this

    // clear previous state
    config.labels = []
    config.datasets.forEach(dataset => {
      dataset.data = []
    })

    // Add new data
    initialData.forEach(item => {
      config.labels.push(item.label)
      config.datasets.forEach((dataset, index) => {
        dataset.data.push(item.data[index])
      })
    })

    this.chart = new ChartJs(this.$refs.chart, {
      type: this.type,
      data: config,
      options: this.options
    })
  }

  redrawChart() {
    if (this.chart) {
      this.chart.destroy()
    }
    this.createChart()
  }

  updateChartData(newVal: ChartData) {
    // Check for fork by comparing labels to see if this chart point already exists in the chart
    const prevIdx = this.chart.data.labels.indexOf(newVal.label)
    if (prevIdx > -1) {
      // Swap this item for the previous one
      this.chart.data.labels[prevIdx] = newVal.label
      this.chart.data.datasets.forEach((dataset, index) => {
        dataset.data[prevIdx] = newVal.data[index]
      })
      return
    }

    const reverse = this.direction === 'rightToLeft'

    // Remove last item
    if (this.chart.data.datasets[0].data.length >= this.maxItems) {
      reverse ? this.chart.data.labels.pop() : this.chart.data.labels.shift()
      this.chart.data.datasets.forEach(dataset => {
        reverse ? dataset.data.pop() : dataset.data.shift()
      })
    }

    // Add new item
    reverse ? this.chart.data.labels.unshift(newVal.label) : this.chart.data.labels.push(newVal.label)
    this.chart.data.datasets.forEach((dataset, index) => {
      reverse ? dataset.data.unshift(newVal.data[index]) : dataset.data.push(newVal.data[index])
    })

    this.chart.update()
  }

  updateInitialData(newVal) {
    // Check for fork and update data in place if necessary
    const prevIdx = this.initialData.findIndex(initial => initial.label === newVal.label)
    if (prevIdx > -1) {
      this.initialData[prevIdx] = newVal
      return
    }

    if (this.initialData && this.initialData.length >= this.maxItems) {
      this.initialData.pop()
    }
    this.initialData.unshift(newVal)
  }
}
</script>

<style scoped lang="css">
.active-button{
  background-color:#3965e8;
  color: white;
  width: 32px;
  margin: 10px;
  border-radius:2px;
  padding: 5px;
}
.button{
  color: #8391a8;
  width: 32px;
  margin: 10px;
  padding: 2px;
}

.xs-chart {
  min-height: 280px
}

.chart-caption {
  min-height: 3em;
}
</style>
