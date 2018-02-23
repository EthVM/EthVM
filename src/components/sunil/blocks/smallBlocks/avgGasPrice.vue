<template>
  <block-component :title="blockTitle" backgroundColor="color5" :value="latestBlockNumber" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>
<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'ShortDataLastBlock',
    data () {
      return {
        blockTitle: 'Average Gas Price (GWEI)',
        blockIconType: 'tachometer',
        blockIconColor: '#c271f5',
        blockBackgroundColor: '#c271f5'

      }
    },
    computed: {
      latestBlockNumber () {
        if (!this.$store.getters.getBlocks[0]) {
          return 'loading'
        }
        return this.$store.getters.getBlocks[0].getIntNumber()
      }
    }
  })
</script>
<style scoped="" lang="less">
  //@import "~lessPath/NewHome/Sections/ShortData/ShortDataHashRate.less";
</style>