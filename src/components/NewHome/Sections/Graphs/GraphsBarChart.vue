<template>
  <div id="GraphsBarChart" class="bar-chart">

    <p class="block-title">Bar Chart</p>    
    <div class="graphs">
      <img src="/img/graph.png">
    </div>

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
