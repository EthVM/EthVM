<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group type="txs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <table-txs
          :transactions="txs"
          page-type="tx"
          :loading="isLoading"
          :max-items="maxItems"
          :total-txs="totalTxs"
          :page="page"
          :error="error"
          @getTxsPage="getPage"
          @updateTable="initialLoad"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Tx, SimpleTx } from '@app/core/models'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    AppCardStatsGroup,
    TableTxs
  }
})
export default class PageTxs extends Vue {
  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  txs: SimpleTx[] = []
  totalTxs = 0

  pages: number[] = []
  from = -1
  page = 0

  isLoading = true
  firstLoad = true
  error = ''
  n = 100

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  mounted() {
    this.initialLoad()
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  initialLoad(): void {
    this.isLoading = true
    this.fetchTotalTxs().then(res => (this.totalTxs = res), err => (this.totalTxs = 0))
    this.getPage(0).then(res => {
      const first = this.txs.length > 0 ? this.txs[0].getBlockNumber() : -1
      this.pages.push(first)
      this.firstLoad = false
    })
    window.scrollTo(0, 0)
  }

  fetchTxs(newPage: number): Promise<SimpleTx[]> {
    if (!this.firstLoad) {
      const length = this.txs.length
      const first = length > 0 ? this.txs[0].getBlockNumber() : -1
      const last = length > 0 ? this.txs[length - 1].getBlockNumber() : -1

      if (newPage > this.page) {
        this.pages.push(first)
        this.from = last
      } else {
        const newFrom = this.pages.pop()
        this.from = newFrom ? newFrom : -1
      }
    }

    this.page = newPage

    return this.$api.getTxs(this.maxItems, 'desc', this.from)
  }

  fetchTotalTxs(): Promise<number> {
    return this.$api.getTotalNumberOfTxs()
  }

  getPage(page: number): Promise<boolean> {
    this.isLoading = true
    return new Promise((resolve, reject) => {
      this.fetchTxs(page).then(
        (res: SimpleTx[]) => {
          this.isLoading = false
          this.txs = res
          resolve(true)
        },
        err => {
          this.error = this.$i18n.t('message.tx.no-history').toString()
          Promise.resolve(false)
          reject()
        }
      )
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: 'tx.mined',
        disabled: true
      }
    ]
  }

  get maxItems(): number {
    return MAX_ITEMS
  }
}
</script>
