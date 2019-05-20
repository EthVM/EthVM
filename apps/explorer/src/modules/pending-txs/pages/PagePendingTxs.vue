<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <table-txs
          :transactions="pendingTxs"
          page-type="pending"
          :loading="isLoading"
          :max-items="maxItems"
          :total-txs="totalTx"
          :page="page"
          :error="error"
          @getTxsPage="getPage"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Tx, PendingTx } from '@app/core/models'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
  }
})
export default class PagePendingTxs extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  pendingTxs: PendingTx[] = []
  totalTx = 0
  isLoading = true
  error = ''
  page = 0

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  created() {
    this.getPage(0)
  }

  mounted() {
    this.fetchTotalPendingTxs().then(
      res => {
        this.totalTx = res
      },
      err => {
        this.totalTx = 0
      }
    )
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getPage(page: number): void {
    this.isLoading = true
    this.page = page
    this.fetchPendingTxs(page).then(
      res => {
        this.isLoading = false
        this.pendingTxs = res as PendingTx[]
      },
      err => {
        this.error = `${JSON.stringify(err)}`
      }
    )
  }

  fetchPendingTxs(page: number): Promise<PendingTx[]> {
    return this.$api.getPendingTxs(this.maxItems, page)
  }

  fetchTotalPendingTxs(): Promise<number> {
    return this.$api.getTotalNumberOfPendingTxs()
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: 'tx.pending',
        disabled: true,
        plural: 2
      }
    ]
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
