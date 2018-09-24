<template>
  <v-container grid-list-lg class="mt-0">
    <v-card fluid flat color="transparent">
      <v-breadcrumbs large>
        <v-icon slot="divider">fa fa-arrow-right</v-icon>
        <v-breadcrumbs-item v-for="item in items" :disabled="item.disabled" :key="item.text" :to="item.link">
          {{ item.text }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-card>
    <v-layout row wrap  justify-space-between class="mb-4">
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
    <v-layout row justify-center class="ma-1">
      <block-latest-blocks :max-items="20" :showHeader="true" class="mt-3"></block-latest-blocks>
    </v-layout>
  </v-container>
</template>


<script lang="ts">
import Vue from 'vue'

const MAX_ITEMS = 20
export default Vue.extend({
  name: 'FramesHome',
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.home'),
          disabled: false,
          link: '/'
        },
        {
          text: this.$i18n.t('title.blocks'),
          disabled: true
        }
      ]
    }
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

<style scoped lang="less">
@import '~lessPath/sunil/global';
</style>
