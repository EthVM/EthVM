<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" page-type="pending" :loading="txsLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import { Vue, Component } from 'vue-property-decorator'
import { Tx } from '@app/core/models'
import { Events } from 'ethvm-common'

@Component({
  components: {
    AppBreadCrumbs,
    TableTxs
  }
})
export default class PagePendingTxs extends Vue {
  // Lifecycle
  created() {
    this.$api.getPendingTxs(100, 0).then(pTxs => {
      this.$store.commit(Events.NEW_PENDING_TX, pTxs)
      if (pTxs && pTxs.length > 0) {
        this.$eventHub.$emit(Events.NEW_PENDING_TX)
      }
    })
  }

  // Computed
  get txs(): Tx[] {
    return this.$store.getters.pendingTxs
  }

  get txsLoad(): boolean {
    return this.txs.length === 0
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
