<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="items"></app-bread-crumbs>
    <v-layout row wrap justify-space-between mb-4>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.last')" :value="latestBlockNumber" color-type="primary white--text" back-type="last-block" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.time')" :value="secSinceLastBlock" color-type="success white--text" back-type="time-since" metrics="sec" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.hashR')" :value="latestHashRate" color-type="warning white--text" back-type="hash-rate" metrics="Th/s" />
      </v-flex>
      <v-flex xs12 sm6 md3>
        <app-info-card :title="$t('smlBlock.diff')" :value="latestDifficulty" color-type="error white--text" back-type="difficulty" metrics="Th" />
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12> <table-blocks :loading="blocksLoad" :blocks="blocks"></table-blocks> </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppInfoCard from '@app/core/components/ui/AppInfoCard.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { LastBlockInfoMixin } from '@app/core/components/mixins'
import { Block } from '@app/core/models'
import { Vue, Component, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    TableBlocks,
    AppInfoCard
  }
})
export default class PageBlocks extends Mixins(LastBlockInfoMixin) {
  data() {
    return {
      items: [
        {
          text: this.$i18n.t('title.blocks'),
          disabled: true
        }
      ]
    }
  }

  // Computed
  get blocks(): Block[] {
    return this.$store.getters.blocks.slice(0, MAX_ITEMS)
  }

  get blocksLoad(): boolean {
    return this.blocks.length === 0
  }
}
</script>
