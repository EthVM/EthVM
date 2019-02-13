<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group type="txs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <table-txs :transactions="txs" page-type="tx" :loading="loading" :max-items="max" :total-txs="total" @getTxsPage="getPage" />
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
  total = 0
  loading = true
  error = false

  // Lifecycle
  mounted() {
    this.fetchTotalTxs().then(
      res => {
        this.total = res
      },
      err => {
        this.total = 0
      }
    )
    this.getPage(0)
  }

  // Methods
  fetchTxs(page: number): Promise<Tx[]> {
    return this.$api.getTxs(this.max, 'desc', -1)
  }

  fetchTotalTxs(): Promise<number> {
    return this.$api.getTotalNumberOfTxs()
  }

  getPage(page: number): void {
    this.loading = true
    this.fetchTxs(page).then(
      res => {
        this.loading = false
        this.txs = res
      },
      err => {
        this.error = true
      }
    )
  }

  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.mined'),
        disabled: true
      }
    ]
  }

  get max(): number {
    return MAX_ITEMS
  }
}
</script>
