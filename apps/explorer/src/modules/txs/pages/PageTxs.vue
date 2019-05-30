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
    Lifecycle
  ===================================================================================
  */

  mounted() {
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
