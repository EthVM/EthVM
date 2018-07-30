<template>
  <block-component :title="blockTitle" backgroundColor="color4" :value="difficulty" :icon-name="blockIconType" :icon-color="blockIconColor"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import sEvents from '@/configs/socketEvents.json'
import bn from 'bignumber.js'
let getTHs = (_num: string): number => {
  return new bn(_num)
    .div('1e12')
    .round(2)
    .toNumber()
}

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: 'Difficulty TH',
      blockIconType: 'asterisk',
      blockIconColor: '#6bee69',
      difficulty: 'Loading'
    }
  },
  created() {
    if (this.$store.getters.getBlocks.length) {
      this.difficulty = getTHs(this.$store.getters.getBlocks[0].getDifficulty().toNumber())
    }
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      this.difficulty = getTHs(this.$store.getters.getBlocks[0].getDifficulty().toNumber())
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

<style scoped="" lang="less">
</style>
