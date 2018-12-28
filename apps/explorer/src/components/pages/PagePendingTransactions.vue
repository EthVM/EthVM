<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :newItems="items"></app-bread-crumbs>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-transactions :transactions="txs" :frameTxs="true" :pending="true"></table-transactions> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Events as sEvents } from 'ethvm-common'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
const MAX_ITEMS = 20

export default Vue.extend({
  name: 'LatestPendingTransactions',
  components: {
    AppBreadCrumbs,
    TableTransactions
  },
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
