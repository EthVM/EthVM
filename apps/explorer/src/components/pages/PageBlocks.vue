<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :newItems="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" colorType="primary white--text" backType="last-block" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" colorType="success white--text" backType="time-since" metrics="sec" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" colorType="warning white--text" backType="hash-rate" metrics="Th/s" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" colorType="error white--text" backType="difficulty" metrics="Th" />
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks v-if="blocks" :blocks="blocks"></table-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Visibility from 'visibilityjs'
import Vue from 'vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import TableBlocks from '@app/components/tables/TableBlocks.vue'
import { lastBlockInfo } from '@app/components/mixins/mixin-last-block-stats'
import { Events as sEvents } from 'ethvm-common'
import BN from 'bignumber.js'
const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FrameBlocks',
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppInfoCard
  },
  mixins: [lastBlockInfo],
  data() {
    return {
      blocks: null,
      items: [
        {
          text: this.$i18n.t('title.blocks'),
          disabled: true
        }
      ],
      maxItems: MAX_ITEMS
    }
  },
  created() {
    this.blocks = this.$store.getters.getBlocks
    this.$eventHub.$on(sEvents.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        this.blocks = this.$store.getters.getBlocks
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(sEvents.newBlock)
  },
  computed: {
    getBlocks() {
      return this.blocks.slice(0, this.maxItems)
    }
  }
})
</script>
