<template>
<canvas ref="chart"
        :width="width"
        :height="height">
</canvas>

</template>

<script lang="ts">
import Chart from 'chart.js'
import Vue from 'vue'
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
