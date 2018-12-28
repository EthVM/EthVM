<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :newItems="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" colorType="primary" backType="last-block" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.success')" :value="latestBlockSuccessTxs" colorType="txSuccess" backType="success-txs" />
      </v-flex>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.failed')" :value="latestBlockFailedTxs" colorType="error" backType="failed-txs" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.pending')" :value="latestBlockPendingTxs" colorType="success" backType="time-since"></app-info-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-transactions :transactions="txs" :frameTxs="true"></table-transactions> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import { lastBlockInfo } from '@app/components/mixins/mixin-last-block-stats'
import Vue from 'vue'
const MAX_ITEMS = 20

export default Vue.extend({
  name: 'PageTransactions',
  components: {
    AppBreadCrumbs,
    AppInfoCard,
    TableTransactions
  },
  mixins: [lastBlockInfo],
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.mined'),
          disabled: true
        }
      ]
    }
  },
  computed: {
    txs() {
      let tx
      tx = this.$store.getters.getTxs
      this.$eventHub.$on(sEvents.newTx, _transactions => {
        tx = this.$store.getters.getTxs
        return tx.slice(0, MAX_ITEMS)
      })
      return tx.slice(0, MAX_ITEMS)
    }
  }
})
</script>
