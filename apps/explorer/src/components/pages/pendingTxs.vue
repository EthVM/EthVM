<template>
  <v-container grid-list-lg class="mb-0">
    <bread-crumbs :newItems="items"></bread-crumbs>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <block-last-transactions :transactions="txs" :showHeader="true" class="mt-3" :pending="true"></block-last-transactions> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-common'

const MAX_ITEMS = 20

export default Vue.extend({
  name: 'LatestPendingTransactions',
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.pending'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    txs() {
      let tx = this.$store.getters.getPendingTxs

      this.$eventHub.$on(sEvents.newPendingTx, _transactions => {
        tx = this.$store.getters.getPendingTxs
        return tx.slice(0, MAX_ITEMS)
      })
      return tx.slice(0, MAX_ITEMS)
    }
  }
})
</script>

<style scoped lang="less">
@import '~lessPath/sunil/global.less';
</style>
