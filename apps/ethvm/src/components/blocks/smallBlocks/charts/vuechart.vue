<template>
  <v-card color="white" flat class="ma-2 mb-3">
    <v-card-title class="title font-weight-bold pt-4 pl-4"
      >{{ chartTitle }}
      <v-tooltip bottom>
        <v-icon slot="activator" dark small class="pl-2">fas fa-exclamation-circle info--text</v-icon>
        <span>{{ chartDescription }}</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-img class="pl-4 pt-4"> <footnote :footnotes="footnoteArr"></footnote> </v-img>
    <canvas ref="chart" :width="width" :height="height"></canvas>
  </v-card>
</template>

<script lang="ts">
import Chart from 'chart.js'
import Vue from 'vue'

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

export default Vue.extend({
  name: 'vue-chart',
  props: {
    type: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: [Object, Array]
    },
    redraw: Boolean,
    options: Object,
    width: Number,
    height: Number,
    chartTitle: String,
    chartDescription: String,
    footnoteArr: Array
  },
  data: () => ({
    chart: ''
  }),

  watch: {
    'data.labels'() {
      this.chart.update()
    },
    'data.datasets'() {
      if (this.redraw) {
        this.chart.destroy()
        this.createChart()
      } else {
        this.chart.update()
      }
    }
  },
  methods: {
    createChart() {
      // @ts-ignore
      this.chart = new Chart(this.$refs.chart, {
        // @ts-ignore
        type: this.type,
        // @ts-ignore
        data: this.data,
        // @ts-ignore
        options: this.options
      })
    }
  },
  mounted() {
    this.createChart()
  },
  beforeDestroy() {
    this.chart.destroy()
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/blocks/smallBlocks/chart.less';
</style>
