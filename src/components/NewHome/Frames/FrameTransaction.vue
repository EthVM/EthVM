<template>
  <div class="individual-transaction">

    <div class="row">

      <div class="col-md-12">
        <div class="block">
          <SinglePagesIndividualTransaction :txHash="txHash"></SinglePagesIndividualTransaction>
        </div>
      </div>

    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesIndivisualTransaction',
    props: ['txHash'],
    data () {
      return {

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Frames/FramesIndivisualTransaction.less";
</style>
