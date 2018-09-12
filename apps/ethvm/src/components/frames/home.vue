<template>
  <v-container grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <h4>{{ $t('subTitle.home') }} </h4>
      <h6 class="text-muted">{{ $t('title.home') }}</h6>
    </v-card>
    <v-layout row wrap justify-space-between>
      <v-flex xs12 md6 lg3>
        <block-last-block></block-last-block>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <block-time-since-last-block></block-time-since-last-block>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <block-hash-rate></block-hash-rate>
      </v-flex>
      <v-flex xs12 md6 lg3>
        <block-difficulty></block-difficulty>
      </v-flex>
    </v-layout>
    <!-- Charts -->
    <v-layout row wrap justify-center>
      <v-flex xs12 md6>
        <bar-chart-last-ten-blocks-tx></bar-chart-last-ten-blocks-tx>
      </v-flex>
      <v-flex xs12 md6>
        <line-chart-ave-tx-fees></line-chart-ave-tx-fees>
      </v-flex>
    </v-layout>
    <!-- End Charts -->
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
