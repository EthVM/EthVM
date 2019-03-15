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
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Tx, PendingTx } from '@app/core/models'
import { Events } from 'ethvm-common'
import { Crumb } from '@app/core/components/props'

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
        this.commitPendingTx(res)
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

  /**
   * After fetching PendingTx[] from API, commit to vuex
   * and emit event.
   *
   * @param  {PendingTx[]} pendingTx - Array of PendingTx[] obtained from API
   */
  commitPendingTx(pendingTx) {
    this.$store.commit(Events.NEW_PENDING_TX, pendingTx)
    if (pendingTx && pendingTx.length > 0) {
      this.$eventHub.$emit(Events.NEW_PENDING_TX)
    }
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  // No Need to ber reactive yet, needs update button on update
  // get pendingTxs(): PendingTx[] {
  //   return this.$store.getters.pendingTxs
  // }

  get crumbs(): Crumb[] {
    return [
      {
        text: this.$i18n.tc('tx.pending', 2),
        disabled: true
      }
    ]
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
