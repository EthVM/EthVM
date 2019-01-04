<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :newItems="items"></app-bread-crumbs>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :maxBlocks="true" :blocks="getuncles" :frameBlocks="false"></table-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import Vue from 'vue'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'

const MAX_ITEMS = 50

export default Vue.extend({
  name: 'FrameUncles',
  components: {
    AppBreadCrumbs,
    TableBlocks
  },
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
