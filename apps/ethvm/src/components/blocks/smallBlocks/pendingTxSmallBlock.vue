<template>
  <block-component :title="blockTitle"  :value="getPendingTx" :icon="iconType" :colorType="type"></block-component>
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
      iconType: 'fa fa-question-circle  white--text',
      type: 'accent white--text'
    }
  },
  computed: {
    getPendingTx() {
      const pending = this.$store.getters.getPendingTxs.length
      return pending
    }
  }
})
</script>

<style scoped lang="less">
</style>
