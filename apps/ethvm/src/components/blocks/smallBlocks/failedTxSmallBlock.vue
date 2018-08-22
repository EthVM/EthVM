<template>
  <block-component :title="blockTitle" backgroundColor="color3" :value="getFailedTx" :icon-name="blockIconType" :icon-color="blockIconColor">
  </block-component>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import BN from 'bignumber.js'
import Vue from 'vue'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.failed'),
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
