<template>
  <div id="ShortDataHashRate" class="difficulty">

    <p class="block-title">Difficulty</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='tachometer' scale='1'></icon></div>
      <p class="block-value">2.17 H</p>
    </div>
    
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
