<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-message :messages="errorMessages" />
        <block-stats :new-block="newBlockNumber" @errorBlockStats="setError" />
        <v-layout row wrap justify-center mb-4>
            <v-flex xs12>
                <recent-blocks :max-items="max" page-type="blocks" @errorBlocksList="setError" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import BlockStats from '@app/modules/blocks/handlers/BlockStats/BlockStats.vue'
import { NewBlockSubscription } from '@app/modules/blocks/NewBlockSubscription/newBlockSubscription.mixin'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import RecentBlocks from '@app/modules/blocks/handlers/RecentBlocks/RecentBlocks.vue'
import { Crumb } from '@app/core/components/props'
import { Vue, Component, Mixins, Watch } from 'vue-property-decorator'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        AppMessage,
        BlockStats,
        RecentBlocks
    }
})
export default class PageBlocks extends Mixins(NewBlockSubscription) {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    errorMessages: ErrorMessageBlock[] = []

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
    @Watch('hasNewBlockUpdateError')
    /**
     * Watches hasNewBlockUpdateError
     * @param newVal {Boolean}
     */
    onHasNewBlockUpdateErrorChanged(newVal: boolean): void {
        this.setError(newVal, ErrorMessageBlock.subscription)
    }
}
</script>
