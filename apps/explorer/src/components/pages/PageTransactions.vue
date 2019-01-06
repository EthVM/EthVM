<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.success')" :value="latestBlockSuccessTxs" color-type="txSuccess" back-type="success-txs" />
      </v-flex>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.failed')" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.pending')" :value="latestBlockPendingTxs" color-type="success" back-type="time-since"></app-info-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-transactions :transactions="txs" :frame-txs="true"></table-transactions> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import AppInfoCard from '@app/components/ui/AppInfoCard.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import { LastBlockInfoMixin } from '@app/components/mixins'
import { Vue, Component, Prop, Provide, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    AppInfoCard,
    TableTransactions
  }
})
export default class PageTransactions extends Mixins(LastBlockInfoMixin) {
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.mined'),
          disabled: true
        }
      ]
    }
  }

  get txs() {
    let tx = this.$store.getters.getTxs
    this.$eventHub.$on(sEvents.newTx, _transactions => {
      tx = this.getTxs
      return tx.slice(0, MAX_ITEMS)
    })
    return tx.slice(0, MAX_ITEMS)
  }
}
</script>
