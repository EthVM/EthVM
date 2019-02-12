<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="pendingTxs" page-type="pending" :loading="loading" :maxItems="max" :totalTxs="total" @getTxsPage="getPage"/> </v-flex>
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
  pendingTxs: Tx[] = []
  total = 0
  loading = true
  error = false

  // Lifecycle
  created() {
    this.fetchPendingTxs(0).then(pTxs => {
      this.$store.commit(Events.NEW_PENDING_TX, pTxs)
      if (pTxs && pTxs.length > 0) {
        this.$eventHub.$emit(Events.NEW_PENDING_TX)
      }
      this.pendingTxs = pTxs
      this.loading = false
    },
    err => {
      this.error = true
    })
  }

    // Lifecycle
  mounted() {
    this.fetchTotalPendingTxs().then(res => {
      this.total = res
    },
    err => {
      this.total = 0
    })
  }


  // Methods

  getPage(_page: number):void {
    this.loading = true
    this.fetchPendingTxs(_page).then(
    res => {
      this.loading = false
      this.pendingTxs = res
    },
    err => {
      this.error = true
    })
  }

  fetchPendingTxs(page: number): Promise<PendingTx[]> {
    return this.$api.getPendingTxs(this.max, page)
  }

  fetchTotalPendingTxs(): Promise<number> {
    return this.$api.getTotalNumberOfPendingTxs()
   }

  // Computed
  // No Need to ber reactive yet, needs update button on update
  // get pendingTxs(): PendingTx[] {
  //   return this.$store.getters.pendingTxs
  // }

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.pending'),
        disabled: true
      }
    ]
  }

   get max(): number {
    return MAX_ITEMS
  }
}
</script>
