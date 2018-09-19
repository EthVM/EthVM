<template>
  <block-component :title="blockTitle"  :value="getFailedTx" :icon="iconType" :colorType="type">
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
      iconType: 'fa fa-times-circle  white--text',
      type: 'warning white--text',
      difficulty: 0
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
