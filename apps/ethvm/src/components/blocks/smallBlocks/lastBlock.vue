<template>
  <block-component primary :title="blockTitle" backgroundColor="color" :value="latestBlockNumber" :icon="iconType"></block-component>
</template>

<script lang="ts">
import Vue from 'vue'
import colors from 'vuetify/es5/util/colors'
import sEvents from '@app/configs/socketEvents.json'

export default Vue.extend({
  name: 'ShortDataLastBlock',
  data() {
    return {
      blockTitle: this.$i18n.t('smlBlock.last'),
      iconType: 'fa fa-cube blue--text text--darken-3',
      color: String(colors.blue.darken4)
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
