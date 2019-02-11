<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="pendingTxs" page-type="pending" :loading="loading" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Tx, PendingTx } from '@app/core/models'
import { Events } from 'ethvm-common'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
  }
})
export default class PagePendingTxs extends Vue {
  page = 0
  loading = true
  error = false

  // Lifecycle
  created() {
    this.fetchPendingTxs(this.page).then(pTxs => {
      this.$store.commit(Events.NEW_PENDING_TX, pTxs)
      if (pTxs && pTxs.length > 0) {
        this.$eventHub.$emit(Events.NEW_PENDING_TX)
      }
      this.loading = false
    })
  }

  // Methods
  fetchPendingTxs(page: number, limit = MAX_ITEMS): Promise<PendingTx[]> {
    return this.$api.getPendingTxs(limit, page)
  }

  // Computed
  get pendingTxs(): PendingTx[] {
    return this.$store.getters.pendingTxs
  }

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.pending'),
        disabled: true
      }
    ]
  }
}
</script>
