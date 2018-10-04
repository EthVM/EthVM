<template>
  <block-component  :title="blockTitle" :colorType="type" :value="difficulty" :icon="iconType">
  </block-component>
</template>

<script lang="ts">
import sEvents from '@app/configs/socketEvents.json'
import bn from 'bignumber.js'
import Vue from 'vue'

const getTHs = (_num: string): number => {
  return new bn(_num)
    .div('1e12')
    .round(2)
    .toNumber()
}

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.diff'),
      iconType: 'fas fa-tachometer-alt white--text',
      type: 'warning white--text',
      difficulty: 0
    }
  },
  created() {
    if (this.$store.getters.getBlocks.length) {
      this.difficulty = getTHs(this.$store.getters.getBlocks[0].getDifficulty().toNumber()).toString() + ' TH'
    }
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.difficulty = getTHs(this.$store.getters.getBlocks[0].getDifficulty().toNumber()) + ' TH'
    })
    this.$eventHub.$on(sEvents.newBlock, _block => {
      this.difficulty = getTHs(_block.getDifficulty().toNumber())
    })
  },
  beforeDestroy() {
    this.$eventHub.$off([sEvents.pastBlocksR, sEvents.newBlock])
  }
})
</script>

<style scoped lang="less">
</style>
