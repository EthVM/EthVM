<template>
  <div id="GraphsBarChart" class="bar-chart">

    <p>Bar Chart</p>
    <p class="block-value">20 Sec</p>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'GraphsBarChart',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/GraphsBarChart.less";
</style>
