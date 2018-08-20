<template>
  <block-component :title="blockTitle" backgroundColor="color2" :value="getPendingTx" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import BN from 'bignumber.js'
import Vue from 'vue'
export default Vue.extend({
  name: 'PendingTxSmallBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.pending'),
      blockIconType: 'asterisk',
      blockIconColor: '#7c76fc'
    }
  },
  computed: {
    getPendingTx() {
      if (!this.$store.getters.getBlocks[0]) {
        return this.$i18n.t('message.load')
      } else {
        const newBlockStat = this.$store.getters.getBlocks[0].getStats()
        const pending = new BN(newBlockStat.pendingTxs).toNumber()
        return pending
      }
    }
  }
})
</script>

<style scoped lang="less">
</style>
