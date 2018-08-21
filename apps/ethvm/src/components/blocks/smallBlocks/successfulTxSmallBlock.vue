<template>
  <block-component :title="blockTitle" backgroundColor="color4" :value="getSuccessfulTx" :icon-name="blockIconType" :icon-color="blockIconColor">
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
      blockTitle: this.$i18n.t('smlBlock.success'),
      blockIconType: 'asterisk',
      blockIconColor: '#6bee69'
    }
  },
  computed: {
    getSuccessfulTx() {
      if (!this.$store.getters.getBlocks[0]) {
        return this.$i18n.t('message.load')
      }
      const newBlockStat = this.$store.getters.getBlocks[0].getStats()
      const successfull = new BN(newBlockStat.success).toNumber()
      return successfull
    }
  }
})
</script>

<style scoped lang="less">
</style>
