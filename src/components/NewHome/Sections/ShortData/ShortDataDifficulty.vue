<template>
  <div id="ShortDataHashRate" class="difficulty">

    <p>Difficulty</p>
    <p class="block-value">2.17 H</p>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataDifficulty.less";
</style>
