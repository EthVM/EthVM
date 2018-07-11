<template>
  <block-component :title="blockTitle" backgroundColor="color4" :value="getSuccessfulTx" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import BN from 'bignumber.js'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: 'Successful Tx',
      blockIconType: 'asterisk',
      blockIconColor: '#6bee69'
    }
  },
  computed: {
    getSuccessfulTx() {
      if (!this.$store.getters.getBlocks[0]) {
        return 'Loading'
      } else {
        let newBlockStat = this.$store.getters.getBlocks[0].getStats()
        let successfull = new BN(newBlockStat.success).toNumber()
        return successfull
      }
    }
  }
})
</script>

<style scoped="" lang="less">
</style>
