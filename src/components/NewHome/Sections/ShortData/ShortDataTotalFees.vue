<template>
  <div class="total-fees">

    <p class="block-title">Total Fees</p>
    
    <div class="bottom-block">
      <div class="icon-block"><icon name='tachometer' scale='1'></icon></div>
      <p class="block-value">2.17 H</p>
    </div>
    
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataTotalFees',
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import '~lessPath/NewHome/globalVars.less';
</style>
