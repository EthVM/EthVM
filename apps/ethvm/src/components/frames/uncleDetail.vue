<template>
  <v-container v-if="block != null" grid-list-lg class="mb-0">
    <bread-crumbs :newItems="getItems"></bread-crumbs>
    <block-block-detail :block="block" :uncles="uncles"></block-block-detail>
  </v-container>
</template>

<script lang="ts">
import { common } from '@app/helpers'
import { Uncle } from '@app/models'
import { Events as sEvents } from 'ethvm-common'
import store from '@app/states'
import Vue from 'vue'

export default Vue.extend({
  name: 'Uncle',
  props: ['uncleRef'],
  data() {
    return {
      common,
      store,
      block: null,
      uncles: null,
      items: [
        {
          text: this.$i18n.t('title.uncles'),
          disabled: false,
          link: '/uncles'
        },
        {
          text: '',
          disabled: true
        }
      ],
      details: []
    }
  },
  computed: {
    getItems() {
      this.items[1].text = this.$i18n.t('block.uncle') + ': ' + this.uncleRef
      return this.items
    }
  },
  mounted() {
    /* Get Block Data: */
    this.$socket.emit(
      sEvents.getUncle,
      {
        hash: this.uncleRef.replace('0x', '')
      },
      (error, result) => {
        if (result) {
          this.block = new Uncle(result)
        }
      }
    )
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
