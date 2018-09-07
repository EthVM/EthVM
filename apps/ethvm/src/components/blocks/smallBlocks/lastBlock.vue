<template>
  <block-component :title="blockTitle" backgroundColor="colordock" :value="latestBlockNumber" :icon="blockIconType"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@app/configs/socketEvents.json'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.last'),
      blockIconType: 'fa fa-cube black--text',
      color: '#c271f5'
    }
  },
  computed: {
    latestBlockNumber() {
      if (!this.$store.getters.getBlocks[0]) {
        return this.$i18n.t('message.load')
      }
      this.$eventHub.$on(sEvents.newBlock, _block => {
        return this.$store.getters.getBlocks[0].getNumber()
      })
      return this.$store.getters.getBlocks[0].getNumber()
    }
  }
})
</script>

<style scoped lang="less">
</style>
