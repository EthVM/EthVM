<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" page-type="pending" :loading="txsLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import TableTxs from '@app/components/tables/TableTxs.vue'
import AppBreadCrumbs from '@app/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Tx } from '@app/models'
import { Events } from 'ethvm-common'

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
  }
})
export default class PagePendingTxs extends Vue {
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

  // Lifecycle
  created() {
    this.$socket.emit(
      Events.pendingTxs,
      {
        limit: 100,
        page: 0
      },
      (err, pTxs) => {
        this.$store.commit(Events.newPendingTx, pTxs)
        if (pTxs && pTxs.length > 0) {
          this.$eventHub.$emit(Events.newPendingTx)
        }
      }
    )
  }

  // Computed
  get txs(): Tx[] {
    return this.$store.getters.getPendingTxs
  }

  get txsLoad(): boolean {
    return this.txs.length === 0
  }
}
</script>
