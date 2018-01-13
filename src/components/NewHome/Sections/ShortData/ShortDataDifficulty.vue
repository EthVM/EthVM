<template>
    <small-block-component :title="blockTitle" :value="hashRate" :icon-name="blockIconType" :icon-color="blockIconColor"></small-block-component>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {
        blockTitle: 'Difficulty',
        blockIconType: 'asterisk',
        blockIconColor: 'green',
        hashRate: '5,100.00 THs'
      }
    }
  })
</script>

<style scoped lang="less">
  @import "~lessPath/NewHome/Sections/ShortData/ShortDataDifficulty.less";
</style>
