<template>
  
  <div class="chart component-shadow">
    <canvas ref="chart" :width="width" :height="height">
    </canvas>
  </div>
</template>
<script lang="ts">
import Chart from 'chart.js'
import Vue from 'vue'

Chart.defaults.global = Object.assign(Chart.defaults.global, {
  defaultFontFamily: "'Open Sans', 'sans-serif'",
  defaultFontStyle: '200',
})

Chart.defaults.global.title = Object.assign(Chart.defaults.global.title, {
  display: false,
})

Chart.defaults.global.tooltips = Object.assign(Chart.defaults.global.tooltips, {
  titleFontStyle: '400',
  backgroundColor: '#686868'
})

Chart.defaults.global.legend = Object.assign(Chart.defaults.global.legend, {
  display: false,
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

export default Vue.extend({
  name: 'vue-chart',
  props: {
    type: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: [
        Object,
        Array
      ]
    },
    redraw: Boolean,
    options: Object,
    width: Number,
    height: Number

  },
  data: () => ({
    chart: ''
  }),

  watch: {
    'data.labels' () {
      this.chart.update()
    },
    'data.datasets' () {
      if (this.redraw) {
        this.chart.destroy()
        this.createChart()
      } else {
        this.chart.update()
      }
    }
  },
  methods: {
    createChart () {
      this.chart = new Chart(this.$refs.chart, {
        type: this.type,
        data: this.data,
        options: this.options

      })
    }
  },
  mounted () {
    this.createChart()
  },
  beforeDestroy () {
    this.chart.destroy()
  }
})
</script>


<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/Chart.less";
</style>


