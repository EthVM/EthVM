<template>
  <div class="block">

    <div class="row">
      <div class="col-md-3 col-sm-3 col-xs-6">
        <div class="block">
          <SinglePagesBlock :blockHash="blockHash"></SinglePagesBlock>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FramesContact',
    props: ['blockHash'],
    data () {
      return {}
    }
  })
</script>

<style scoped lang="less">
  
</style>
