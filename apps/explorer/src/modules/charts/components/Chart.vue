<template>
  <v-card color="white" flat class="mb-3 pa-1">
    <v-layout align-center row wrap mb-0>
      <v-flex grow>
        <v-card-title class="title font-weight-bold pb-1">{{ chartTitle }}</v-card-title>
        <v-card-text class="pt-0 pb-0 info--text caption">{{ chartDescription }}</v-card-text>
      </v-flex>
      <v-flex xs12 sm3 v-if="!liveChart">
        <v-layout align-center justify-end pa-3>
          <button flat :class="classAll" @click="toggleData = 0" small>{{ $tc('charts.states.all', 2) }}</button>
          <button flat :class="classWeek" @click="toggleData = 1" small>{{ $tc('charts.states.week', 2) }}</button>
          <button flat :class="classMonth" @click="toggleData = 2" small>{{ $tc('charts.states.month', 2) }}</button>
          <!-- <button flat :class="classMonth" small>1Y</button> -->
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
import { ChartData } from '@app/modules/charts/props'
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
  @Prop({ type: Object, required: true }) data!: ChartData
  @Prop({ type: Boolean }) redraw!: boolean
  @Prop({ type: Object }) options!: object
  @Prop({ type: String }) chartTitle!: string
  @Prop({ type: String }) chartDescription!: string
  @Prop({ type: Array }) footnotes?: Footnote[]
  @Prop({ type: Boolean }) dataLoading?: boolean
  @Prop({ type: String }) error!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  toggleData = 0
  updateChart = false
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
    if (this.data && this.data.datasets && this.data.datasets[0].data.length !== 0) {
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
  get classAll(): string {
    return this.toggleData === 0 ? 'active-button' : 'button'
  }

  get classWeek(): string {
    return this.toggleData === 1 ? 'active-button' : 'button'
  }

  get classMonth(): string {
    return this.toggleData === 2 ? 'active-button' : 'button'
  }

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

  @Watch('data')
  onDataChanged(): void {
    if (this.redraw) {
      if (this.chart) {
        this.chart.destroy()
      }
      this.createChart()
    } else {
      if (!this.chart) {
        this.createChart()
      }
      this.chart.update()
    }
  }

  @Watch('toggleData')
  onTogleDataChanged(newVal: number, oldVal: number): void {
    this.$emit('timeFrame', newVal)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  createChart() {
    this.chart = new ChartJs(this.$refs.chart, {
      type: this.type,
      data: this.data,
      options: this.options
    })
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
</style>
