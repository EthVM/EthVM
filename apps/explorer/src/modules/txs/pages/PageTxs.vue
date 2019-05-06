<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group type="txs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12>
        <table-txs page-type="tx" :max-items="maxItems" />
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
    window.scrollTo(0, 0)
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
