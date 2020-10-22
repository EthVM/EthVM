<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-error v-if="hasError" :has-error="hasError" :message="$t('message.invalid.block')" />
        <app-message :messages="errorMessages" />

        <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
        <block-details v-if="isValid" :block-ref="blockRef" :is-hash="isHash" @errorDetails="setError" @isMined="setIsMined" @setBlockNumber="setBlockNumber" />

        <!--
    =====================================================================================
      TX TABLE
    =====================================================================================
    -->
        <!-- TODO: Implement get block transfers by hash -->
        <block-txs
            v-if="isValid && hasNumber"
            :max-items="maxItems"
            :block-ref="blockNumber"
            :is-hash="isHash"
            :is-mined="isMined"
            page-type="blockDetails"
            @errorTxs="setError"
        />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import BlockDetails from '@app/modules/blocks/handlers/BlockDetails/BlockDetails.vue'
import BlockTxs from '@app/modules/txs/handlers/BlockTxs/BlockTxs.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { ErrorMessageBlock } from '@app/modules/blocks/models/ErrorMessagesForBlock'

const MAX_TXS = 10

@Component({
    components: {
        AppBreadCrumbs,
        AppError,
        AppDetailsList,
        AppMessage,
        BlockDetails,
        BlockTxs
    }
})
export default class PageDetailsBlock extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop({ type: String }) blockRef!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    errorMessages: ErrorMessageBlock[] = []
    isMined = false
    blockNumber: string = ''

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    created() {
        window.scrollTo(0, 0)
    }
    mounted() {
        if (!this.isHash) {
            this.blockNumber = this.blockRef
        }
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Sets isMined to true
     */
    setIsMined(): void {
        this.isMined = true
    }
    /**
     * Set block Number
     * @param value {String}
     */
    setBlockNumber(value: string): void {
        this.blockNumber = value
    }
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

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get hasError(): boolean {
        return !this.isValid
    }

    get isValid(): boolean {
        return eth.isValidHash(this.blockRef) || eth.isValidBlockNumber(this.blockRef)
    }

    get isHash(): boolean {
        return eth.isValidHash(this.blockRef)
    }
    get hasNumber(): boolean {
        return this.blockNumber !== ''
    }

    /**
     * Returns breadcrumbs entry for this particular view.
     * Required for AppBreadCrumbs
     *
     * @return {Array} - Breadcrumb entry. See description.
     */
    get crumbs(): Crumb[] {
        const crumbs: Crumb[] = [
            {
                text: this.$tc('block.name', 2),
                link: '/blocks'
            }
        ]
        if (!this.isValid) {
            crumbs.push({
                text: this.$tc('block.name', 1)
            })
            return crumbs
        } else if (eth.isValidHash(this.blockRef)) {
            crumbs.push({
                text: this.$t('block.number'),
                hash: this.$route.params.blockRef
            })
            return crumbs
        }
        crumbs.push({
            text: `${this.$t('block.number')} ${this.$route.params.blockRef}`
        })
        return crumbs
    }
    get maxItems(): number {
        return MAX_TXS
    }
}
</script>
