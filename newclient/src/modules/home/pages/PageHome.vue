<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs />
        <app-message :messages="errorMessages" />

        <!--
        =====================================================================================
          Card Stats
        =====================================================================================
        -->
        <block-stats :new-block="newBlockNumber" @errorBlockStats="setError" />
        <!--
        =====================================================================================
          Latest Blocks
        =====================================================================================
        -->
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <recent-blocks :max-items="maxItems" page-type="home" @errorBlocksList="setError" />
            </v-flex>
        </v-layout>
        <!--
        =====================================================================================
          Latest Txs
        =====================================================================================
        -->
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <home-txs :max-items="maxItems" :new-block="newBlockNumber" page-type="home" @errorTxs="setError" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import BlockStats from '@app/modules/blocks/handlers/BlockStats/BlockStats.vue'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import RecentBlocks from '@app/modules/blocks/handlers/RecentBlocks/RecentBlocks.vue'
import HomeTxs from '@app/modules/txs/handlers/BlockTxs/BlockTxs.vue'
import { Component, Mixins } from 'vue-property-decorator'
import { fromWei, toBN } from 'web3-utils'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        AppMessage,
        BlockStats,
        RecentBlocks,
        HomeTxs
    }
})
export default class PageHome extends Mixins(NewBlockSubscription) {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    errorMessages: ErrorMessageBlock[] = []
    /*
    ===================================================================================
      Computed
    ===================================================================================
    */
    get maxItems(): number {
        return MAX_ITEMS
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets error messages if any
     * @param hasError {Boolean}
     * @param message {ErrorMessageBlock}
     */
    setError(hasError: boolean, message: ErrorMessageBlock): void {
        if (hasError) {
            if (!this.errorMessages.includes(message)) {
                this.errorMessages.push(message)
            }
        } else {
            if (this.errorMessages.length > 0) {
                const index = this.errorMessages.indexOf(message)
                if (index > -1) {
                    this.errorMessages.splice(index, 1)
                }
            }
        }
    }
}
</script>
