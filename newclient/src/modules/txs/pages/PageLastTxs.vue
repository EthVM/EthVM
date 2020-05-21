<template>
    <v-container grid-list-lg class="mt-0">
        <app-bread-crumbs :new-items="crumbs" />
        <!-- <app-card-stats-group type="txs" /> -->
        <v-layout row justify-center mb-4>
            <v-flex xs12>
                <!-- <block-txs page-type="tx" /> -->
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
// import AppCardStatsGroup from '@app/core/components/ui/AppCardStatsGroup.vue'
// import BlockTxs from '@app/modules/txs/handlers/BlockTxs/BlockTxs.vue'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'

const MAX_ITEMS = 50

@Component({
    components: {
        AppBreadCrumbs
        // BlockTxs
    }
})
export default class PageBlockTxs extends Vue {
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
                text: this.$t('tx.mined')
            }
        ]
    }
}
</script>
