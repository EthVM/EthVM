<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group type="txs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <table-txs :transactions="txs" page-type="tx" :loading="isLoading" :max-items="maxItems" :total-txs="totalTx" :error="error" @getTxsPage="getPage" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Tx } from '@app/core/models'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    AppCardStatsGroup,
    TableTxs
  }
})
export default class PageTxs extends Vue {
  txs: Tx[] = []
  totalTx = 0
  isLoading = true
  error = ''

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.fetchTotalTxs().then(
      res => {
        this.totalTx = res
      },
      err => {
        this.totalTx = 0
      }
    )
    this.getPage(0)
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  fetchTxs(page: number): Promise<Tx[]> {
    return this.$api.getTxs(this.maxItems, page)
  }

  fetchTotalTxs(): Promise<number> {
    return this.$api.getTotalNumberOfTxs()
  }

  getPage(page: number): void {
    this.isLoading = true
    this.fetchTxs(page).then(
      res => {
        this.isLoading = false
        this.txs = res as Tx[]
      },
      err => {
        this.error = this.$i18n.t('message.noTxHistory').toString()
      }
    )
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.mined'),
        disabled: true
      }
    ]
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
