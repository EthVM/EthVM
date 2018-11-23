<template>
  <v-container grid-list-lg class="pa-0 mt-0 mb-0">
    <v-layout row wrap mb-4>
      <v-flex xs12>
        <v-breadcrumbs large ma-0 pa-0>
          <v-icon slot="divider">fa fa-arrow-right</v-icon>
          <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link"></v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12><block-latest-blocks :maxBlocks="true" :blocks="getuncles" :frameBlocks="false"></block-latest-blocks></v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-common'
import BN from 'bignumber.js'
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FrameUncles',
  data() {
    return {
      uncles: null,
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
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
    this.$eventHub.$on(sEvents.newUncle, _uncle => {
      if (Visibility.state() === 'visible') {
        this.uncles = this.$store.getters.getUncles
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(sEvents.newUncle)
  },
  computed: {
    getuncles() {
      return this.uncles.slice(0, this.maxItems)
    }
  }
})
</script>
