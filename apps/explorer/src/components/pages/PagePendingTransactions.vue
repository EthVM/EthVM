<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" :frame-txs="true" page-type="pending" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Events } from 'ethvm-common'
import TableTxs from '@app/components/tables/TableTxs.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 20

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
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
    let txs = this.$store.getters.getPendingTxs || []

    this.$eventHub.$on(Events.newPendingTx, _transactions => {
      txs = this.$store.getters.getPendingTxs || []
      return txs.slice(0, MAX_ITEMS)
    })

    return txs.slice(0, MAX_ITEMS)
  }
}
</script>
