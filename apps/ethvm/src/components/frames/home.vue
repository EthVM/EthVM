<template>
  <v-container grid-list-lg class="pa-0 mt-0 mb-0">
    <v-layout row wrap mb-4>
      <v-icon class="fa fa-home black--text pl-2" small></v-icon>
      <h4 class="ml-2">{{ $t('title.home') }}</h4>
    </v-layout>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3> <block-last-block></block-last-block> </v-flex>
      <v-flex xs12 sm6 md3> <block-time-since-last-block></block-time-since-last-block> </v-flex>
      <v-flex xs12 sm6 md3> <block-hash-rate></block-hash-rate> </v-flex>
      <v-flex xs12 sm6 md3> <block-difficulty></block-difficulty> </v-flex>
    </v-layout>
    <!-- Charts -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12 md6> <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx> </v-flex>
      <v-flex xs12 md6> <line-chart-ave-tx-fees></line-chart-ave-tx-fees> </v-flex>
    </v-layout>
    <!-- End Charts -->
    <!-- Last Blocks -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <block-latest-blocks v-if="blocks" :maxBlocks="true" :blocks="blocks" showStyle="max-height: 590px"></block-latest-blocks> </v-flex>
    </v-layout>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <block-last-transactions :transactions="txs" showStyle="max-height: 590px"></block-last-transactions> </v-flex>
    </v-layout>
    <!-- End Last Txs -->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import Visibility from 'visibilityjs'
import { Events } from 'ethvm-common'
import BN from 'bignumber.js'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FramesHome',
  data() {
    return {
      blocks: null
    }
  },
  created() {
    this.blocks = this.$store.getters.getBlocks
    this.$eventHub.$on(Events.newBlock, _block => {
      if (Visibility.state() === 'visible') {
        this.blocks = this.$store.getters.getBlocks.slice(0, MAX_ITEMS)
      }
    })
  },
  beforeDestroy() {
    this.$eventHub.$off(Events.newBlock)
  },
  computed: {
    txs() {
      if (this.$store.getters.getTxs.length) {
        return this.$store.getters.getTxs.slice(0, MAX_ITEMS)
      }
      return []
    }
  }
})
</script>
