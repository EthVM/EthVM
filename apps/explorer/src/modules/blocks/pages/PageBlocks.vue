<template>
  <v-container grid-list-lg class="mb-0">
    <app-bread-crumbs :new-items="crumbs" />
    <app-card-stats-group />
    <v-layout row wrap justify-center mb-4>
      <v-flex xs12>
        <last-blocks :max-items="max" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import LastBlocks from '@app/modules/blocks/components/BlockTableLayout/BlockTableLayout.vue'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
  components: {
    AppBreadCrumbs,
    AppCardStatsGroup,
    TableBlocks,
    LastBlocks
  }
})
export default class PageBlocks extends Vue {
  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get crumbs(): Crumb[] {
    return [
      {
        text: 'block.name',
        disabled: true,
        plural: 2
      }
    ]
  }

  get max(): number {
    return MAX_ITEMS
  }
}
</script>
