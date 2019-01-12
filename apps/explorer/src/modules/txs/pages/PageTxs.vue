<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary" back-type="last-block" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.success')" :value="latestBlockSuccessTxs" color-type="txSuccess" back-type="success-txs" />
      </v-flex>
      <v-flex xs12 md6 lg3> <app-info-card :title="$t('smlBlock.failed')" :value="latestBlockFailedTxs" color-type="error" back-type="failed-txs" /> </v-flex>
      <v-flex xs12 md6 lg3>
        <app-info-card :title="$t('smlBlock.pending')" :value="latestBlockPendingTxs" color-type="success" back-type="time-since"></app-info-card>
      </v-flex>
    </v-layout>
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" page-type="tx" :loading="txsLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { LastBlockInfoMixin } from '@app/core/components/mixins'
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Tx } from '@app/core/models'

@Component({
  components: {
    AppBreadCrumbs,
    AppInfoCard,
    TableTxs
  }
})
export default class PageTxs extends Mixins(LastBlockInfoMixin) {
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.mined'),
          disabled: true
        }
      ]
    }
  }

  // Computed
  get txs(): Tx[] {
    return this.$store.getters.getTxs
  }

  get txsLoad(): boolean {
    return this.txs.length == 0
  }
}
</script>
