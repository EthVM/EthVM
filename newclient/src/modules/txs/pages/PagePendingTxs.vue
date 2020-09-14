<template>
    <v-container grid-list-lg class="mt-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-message :messages="errorMessages" />
        <v-layout row justify-center mb-4>
            <v-flex xs12>
                <pending-txs :max-items="maxItems" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import PendingTxs from '@app/modules/txs/handlers/PendingTxs/PendingTxs.vue'
import { Crumb } from '@app/core/components/props'
import { Vue, Component } from 'vue-property-decorator'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

const MAX_ITEMS = 50

@Component({
    components: {
        AppBreadCrumbs,
        AppMessage,
        PendingTxs
    }
})
export default class PageTxs extends Vue {
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    errorMessages: ErrorMessageBlock[] = []

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
                text: this.$tc('tx.pending', 2)
            }
        ]
    }

    get maxItems(): number {
        return MAX_ITEMS
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
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
