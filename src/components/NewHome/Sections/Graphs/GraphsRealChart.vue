<template>
  <div id="GraphsRealChart" class="real-chart">

    <p class="block-title">Real Chart</p>
    <div class="graphs">
      <img src="/img/graph.png">
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'GraphsRealChart',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/Graphs/GraphsRealChart.less";
</style>
