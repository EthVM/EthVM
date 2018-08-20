<template>
  <block-component :title="blockTitle" backgroundColor="color1" :value="latestBlockNumber" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.last'),
      blockIconType: 'tachometer',
      blockIconColor: '#c271f5'
    }
  },
  computed: {
    latestBlockNumber() {
      if (!this.$store.getters.getBlocks[0]) {
        return this.$i18n.t('message.load')
      }
      this.$eventHub.$on(sEvents.newBlock, _block => {
        return this.$store.getters.getBlocks[0].getIntNumber()
      })
      return this.$store.getters.getBlocks[0].getIntNumber()
    }
  }
})
</script>

<style scoped="" lang="less">
</style>
