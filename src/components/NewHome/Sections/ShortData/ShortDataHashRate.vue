<template>
  <small-block-component :title="blockTitle" :value="hashRate" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {
        blockTitle: 'Hash Rate TH/s',
        blockIconType: 'hashtag',
        blockIconColor: 'orange',
        hashRate: '2,103.79'

      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataHashRate.less";
</style>
