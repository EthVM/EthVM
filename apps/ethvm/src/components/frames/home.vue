<template>
  <v-container grid-list-lg class="pa-0 mt-1">
    <v-layout row wrap mb-3>
      <v-icon class="fa fa-home black--text pl-2" small></v-icon>
      <h4 class="ml-2">{{ $t('title.home') }}</h4>
    </v-layout>
    <v-layout row wrap justify-space-between mb-3>
      <v-flex xs12 sm6 md3>
        <block-last-block></block-last-block>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <block-time-since-last-block></block-time-since-last-block>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <block-hash-rate></block-hash-rate>
      </v-flex>
      <v-flex xs12 sm6 md3>
        <block-difficulty></block-difficulty>
      </v-flex>
    </v-layout>
    <!-- Charts -->
    <v-layout row wrap justify-center mb-3>
      <v-flex xs12 md6>
        <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
      </v-flex>
      <v-flex xs12 md6>
        <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
      </v-flex>
    </v-layout>
    <!-- End Charts -->
    <!-- Last Blocks -->
    <block-latest-blocks :max-items="20" :showHeader="true" showStyle="max-height: 609px"></block-latest-blocks>
    <!-- End Last Blocks -->
    <!-- Last Txs -->
    <v-layout row class="mt-3">
      <v-flex xs6>
        <h2>{{ $t('title.lastTxs') }}</h2>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs2>
        <v-layout justify-end>
          <v-btn color="primary" to="/transactions"> {{ $t('bttn.viewAll') }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <block-last-transactions :transactions="txs" :showHeader="true " showStyle="max-height: 609px"></block-last-transactions>
    <!-- End Last Txs -->
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
const MAX_ITEMS = 20

export default Vue.extend({
  name: 'FramesHome',
  data() {
    return {}
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
