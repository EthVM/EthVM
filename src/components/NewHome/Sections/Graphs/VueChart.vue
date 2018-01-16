<template>
<canvas ref="chart"
        :width="width"
        :height="height">
</canvas>

</template>

<script lang="ts">
import Chart from 'chart.js'
import Vue from 'vue'
Chart.defaults.global.title.fontFamily = "'Poppins', 'sans-serif'"
Chart.defaults.global.title.fontStyle = '400'
Chart.defaults.global.tooltips.titleFontFamily = "'Poppins', 'sans-serif'"
Chart.defaults.global.tooltips.titleFontStyle = '400'
Chart.defaults.global.tooltips.bodyFontFamily = "'Poppins', 'sans-serif'"
Chart.defaults.global.tooltips.bodyFontStyle = '200'
Chart.defaults.global.legend.fontFamily = "'Poppins', 'sans-serif'"
Chart.defaults.global.legend.fontStyle = '200'

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
  @import "~lessPath/NewHome/globalVars.less";
</style>