<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <block-stats :new-block="newBlockNumber" />

        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <recent-blocks :max-items="max" page-type="blocks" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import BlockStats from '@app/modules/blocks/handlers/BlockStats/BlockStats.vue'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'

import RecentBlocks from '@app/modules/blocks/handlers/RecentBlocks/RecentBlocks.vue'
import { Crumb } from '@app/core/components/props'
import { Vue, Component, Mixins } from 'vue-property-decorator'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        BlockStats,
        RecentBlocks
    }
})
export default class PageBlocks extends Mixins(NewBlockSubscription) {
    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get crumbs(): Crumb[] {
        return [
            {
                text: this.$tc('block.name', 2)
            }
        ]
    }

    get max(): number {
        return MAX_ITEMS
    }
}
</script>
