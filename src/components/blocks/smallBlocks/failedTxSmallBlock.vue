<template>
  <block-component :title="blockTitle" backgroundColor="color3" :value="getFailedTx" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: 'Failed Tx',
      blockIconType: 'asterisk',
      blockIconColor: '#f9967b'
    }
  },
  computed: {
    getFailedTx() {
      if (!this.$store.getters.getBlocks[0]) {
        return 'Loading'
      }
      const newBlockStat = this.$store.getters.getBlocks[0].getStats()
      const failed = new BN(newBlockStat.failed).toNumber()
      return failed
    }
  }
})
</script>

<style scoped lang="less">
</style>
