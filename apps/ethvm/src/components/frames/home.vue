<template>
  <div>
    <h4>{{ $t('subTitle.home') }}</h4>
    <h6 class="text-muted">{{ $t('title.home') }}</h6>
    <v-container v-container fluid grid-list-xl class="pr-0 pl-0">
      <v-layout justify-space-between >
        <v-flex sm12 md6 lg3>
          <block-last-block></block-last-block>
        </v-flex>
        <v-flex sm12 md6 lg3>
          <block-time-since-last-block></block-time-since-last-block>
        </v-flex>
        <v-flex sm12 md6 lg3>
          <block-hash-rate></block-hash-rate>
        </v-flex>
        <v-flex sm12 md6 lg3>
          <block-difficulty></block-difficulty>
        </v-flex>
      </v-layout>
    </v-container>

  </div>
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
