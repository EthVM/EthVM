<template>
  <v-container grid-list-lg class="mb-0">
    <bread-crumbs :newItems="items"></bread-crumbs>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <block-latest-blocks :maxBlocks="true" :blocks="getuncles" :frameBlocks="false"></block-latest-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import Vue from 'vue'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FrameUncles',
  data() {
    return {
      uncles: null,
      items: [
        {
          text: this.$i18n.t('title.uncles'),
          disabled: true
        }
      ],
      maxItems: MAX_ITEMS
    }
  },
  created() {
    this.uncles = this.$store.getters.getUncles
    this.$eventHub.$on(Events.newUncle, _uncle => {
      if (Visibility.state() === 'visible') {
        this.uncles = this.$store.getters.getUncles
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(Events.newUncle)
  },
  computed: {
    getuncles() {
      return this.uncles.slice(0, this.maxItems)
    }
  }
})
</script>
