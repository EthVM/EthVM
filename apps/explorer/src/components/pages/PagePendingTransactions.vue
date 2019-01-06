<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-transactions :transactions="txs" :frame-txs="true" :pending="true"></table-transactions> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events as sEvents } from 'ethvm-common'
import TableTransactions from '@app/components/tables/TableTransactions.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    TableTransactions
  }
})
export default class PagePendingTransactions extends Vue {
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.pending'),
          disabled: true
        }
      ]
    }
  }

  get txs() {
    let tx = this.getPendingTxs

    this.$eventHub.$on(sEvents.newPendingTx, _transactions => {
      tx = this.getPendingTxs
      return tx.slice(0, MAX_ITEMS)
    })

    return tx.slice(0, MAX_ITEMS)
  }
}
</script>
