<template>
  <v-container grid-list-lg class="mt-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-info-card-group :type="txs" />
    <v-layout row justify-center mb-4>
      <v-flex xs12> <table-txs :transactions="txs" page-type="tx" :loading="txsLoad" /> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppInfoCardGroup from '@app/core/components/ui/AppInfoCardGroup.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Vue, Component, Mixins } from 'vue-property-decorator'
import { Tx } from '@app/core/models'

@Component({
  components: {
    AppBreadCrumbs,
    AppInfoCardGroup,
    TableTxs
  }
})
export default class PageTxs extends Vue {
  // Computed
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.mined'),
        disabled: true
      }
    ]
  }

  get txs(): Tx[] {
    return this.$store.getters.txs
  }

  get txsLoad(): boolean {
    return this.txs.length == 0
  }
}
</script>
