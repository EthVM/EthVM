<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-eth-blocks class="mb-3" :category="matomoCategory" />
        <app-message :messages="errorMessages" />
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <!--
        =====================================================================================
          TX DETAILS LIST
        =====================================================================================
        -->
        <tx-details v-if="isValid && !hasError" :tx-ref="txRef" @errorDetails="setError" />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppEthBlocks from '@app/core/components/ui/AppEthBlocks.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import AppMessage from '@app/core/components/ui/AppMessage.vue'
import { eth } from '@app/core/helper'
import { Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TxDetails from '@app/modules/txs/handlers/TxDetails/TxDetails.vue'
import { ErrorMessageTx } from '@app/modules/txs/models/ErrorMessagesForTx'
import { Category } from '@app/core/components/mixins/Matomo/matomoEnums'

@Component({
    components: {
        AppBreadCrumbs,
        AppError,
        AppEthBlocks,
        AppMessage,
        TxDetails
    }
})
export default class PageDetailsTxs extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) txRef!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */
    errorMessages: ErrorMessageTx[] = []
    error = ''
    matomoCategory = Category.TXS_PAGE

    /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

    created() {
        // Check that current tx ref is valid one
        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.tx').toString()
            return
        }

        window.scrollTo(0, 0)
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

    get isValid(): boolean {
        return eth.isValidHash(this.txRef)
    }

    get hasError(): boolean {
        return this.error !== ''
    }

    /*
 ===================================================================================
   Methods
 ===================================================================================
 */

    /**
     * Returns breadcrumbs entry for this particular view.
     * Required for AppBreadCrumbs
     *
     * @return {Array} - Breadcrumb entry. See description.
     */
    get crumbs(): Crumb[] {
        return [
            {
                text: this.$t('tx.mined-tx'),
                link: '/txs'
            },
            {
                text: this.$tc('tx.hash', 1),
                hash: this.txRef
            }
        ]
    }
    /**
     * Sets error if any
     * @param hasError {Boolean}
     * @param message {ErrorMessageToken}
     */
    setError(hasError: boolean, message: ErrorMessageTx): void {
        if (hasError) {
            if (message === ErrorMessageTx.notFound) {
                this.error = this.$i18n.t(message).toString()
            } else {
                if (!this.errorMessages.includes(message)) {
                    this.errorMessages.push(message)
                }
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
