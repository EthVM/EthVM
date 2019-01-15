<template>
  <v-card color="white" flat class="ma-2 mb-3">
    <v-layout align-center row>
      <v-flex xs8>
        <v-card-title class="title font-weight-bold pl-4">
          {{ chartTitle }}
          <v-tooltip bottom>
            <v-icon slot="activator" dark small class="pl-2">fas fa-exclamation-circle info--text</v-icon>
            <span>{{ chartDescription }}</span>
          </v-tooltip>
        </v-card-title>
      </v-flex>
      <v-flex xs4 v-if="!liveChart">
        <v-layout v-if=" getPageType() === 'charts'" align-center justify-end fill-height>
            <v-btn flat color="secondary" class="text-capitalize" :to="'/chart/' + chartID">{{ $t('bttn.more') }} <v-icon right>fas fa-angle-right</v-icon></v-btn>
        </v-layout>
        <v-layout v-else row align-center justify-end fill-height>
          <v-btn-toggle depressed v-model="toggleData" class="primary">
            <v-btn flat :value="0" small>All</v-btn>
            <v-btn flat :value="1" small>1D</v-btn>
            <v-btn flat :value="2" small>1W</v-btn>
            <v-btn flat :value="3" small>1M</v-btn>
          </v-btn-toggle>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout align-center justify-end row fill-height v-if="footnoteArr.length > 0">
      <app-footnotes :footnotes="footnoteArr" />
    </v-layout>
    <canvas ref="chart" :width="width" :height="height"></canvas>
  </v-card>
</template>

<script lang="ts">
  import Chart from 'chart.js'
  import AppFootnotes from '@app/core/components/ui/AppFootnotes.vue'
  import {
    Vue,
    Component,
    Prop,
    Watch
  } from 'vue-property-decorator'
  import {
    Footnote
  } from '@app/core/components/props'

  Chart.defaults.global = Object.assign(Chart.defaults.global, {
    defaultFontFamily: "'Open Sans', 'sans-serif'",
    defaultFontStyle: '200'
  })

  Chart.defaults.global.title = Object.assign(Chart.defaults.global.title, {
    display: false
  })

  Chart.defaults.global.tooltips = Object.assign(Chart.defaults.global.tooltips, {
    titleFontStyle: '400',
    backgroundColor: '#686868'
  })

  Chart.defaults.global.legend = Object.assign(Chart.defaults.global.legend, {
    display: false
  })

  Chart.defaults.global.layout = Object.assign(Chart.defaults.global.layout, {
    padding: {
      left: 5,
      right: 5,
      top: 20,
      bottom: 20
    }
  })

  Chart.defaults.global.elements.point = Object.assign(Chart.defaults.global.elements.point, {
    hoverRadius: 6,
    borderWidth: 2
  })

  Chart.defaults.doughnut.animation = Object.assign(Chart.defaults.doughnut.animation, {
    animateRotate: true
  })

  @Component({
    components: {
      AppFootnotes
    }
  })
  export default class AppChart extends Vue {
    @Prop ({type: Boolean, default: false}) liveChart!: boolean
    @Prop({ type: String, required: true}) chartID!: string
    @Prop({
      type: String,
      required: true
    }) type!: string
    @Prop({
      type: Object,
      required: true
    }) data: object[]
    @Prop({
      type: Boolean
    }) redraw!: boolean
    @Prop({
      type: Object
    }) options!: object
    @Prop({
      type: Number
    }) width!: number
    @Prop({
      type: Number
    }) height!: number
    @Prop({
      type: String
    }) chartTitle!: string
    @Prop({
      type: String
    }) chartDescription!: string
    @Prop({
      type: Array
    }) footnoteArr!: Footnote[]


    toggleData = 1
    /*LifeCycle: */
    mounted() {
      this.createChart()
    }
    beforeDestroy() {
      this.chart.destroy()
    }

    /* Watchers: */

    @Watch('data.labels')
    onDataLabelsChanged(): void {
      this.chart.update()
    }

    @Watch('data.datasets')
    onDataDatasetsChanged(): void {
      if (this.redraw) {
        this.chart.destroy()
        this.createChart()
      } else {
        this.chart.update()
      }
    }

    /*Methods: */
    createChart() {
      this.chart = new Chart(this.$refs.chart, {
        type: this.type,
        data: this.data,
        options: this.options
      })
    }

    getPageType(): string {
      console.log(this.$route.name)
      return this.$route.name
    }
  }
</script>


