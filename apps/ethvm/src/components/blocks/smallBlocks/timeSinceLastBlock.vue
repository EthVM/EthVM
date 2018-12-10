<template>
  <block-component :title="blockTitle" :colorType="type" :value="seconds" :backType="background" :metrics="sec"></block-component>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import Vue from 'vue'
export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.time'),
      background: 'time-since',
      type: 'success white--text',
      lastBlockTime: 0,
      seconds: 0,
      sec: 'sec'
    }
  },
  created() {
    if (this.$store.getters.getBlocks && this.$store.getters.getBlocks.length > 0) {
      this.lastBlockTime = this.$store.getters.getBlocks[0].getTimestamp()
    }
    this.$eventHub.$on(sEvents.pastBlocksR, () => {
      const blocks = this.$store.getters.getBlocks
      this.lastBlockTime = blocks.length > 0 ? blocks[0].getTimestamp() : 0
    })
    this.$eventHub.$on(sEvents.newBlock, block => {
      this.lastBlockTime = new Date().getTime()
    })
  },
  beforeDestroy() {
    this.$eventHub.$off([sEvents.pastBlocksR, sEvents.newBlock])
  },
  mounted() {
    setInterval(() => {
      if (!this.$store.getters.getBlocks.length) {
        this.seconds = this.$i18n.t('message.load')
        return
      }
      this.seconds = Math.ceil((new Date().getTime() - this.lastBlockTime) / 1000)
    }, 1000)
  }
})
</script>

<style scoped lang="less"></style>
