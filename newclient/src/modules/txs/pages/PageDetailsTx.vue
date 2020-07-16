<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <app-error v-if="hasError" :has-error="hasError" :message="error" />
        <!--
    =====================================================================================
      TX DETAILS LIST
    =====================================================================================
    -->
        <tx-details v-if="isValid" :tx-ref="txRef" />
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppError from '@app/core/components/ui/AppError.vue' 
import { eth } from '@app/core/helper'
import { Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import TxDetails from '@app/modules/txs/handlers/TxDetails/TxDetails.vue'

@Component({
    components: {
        AppBreadCrumbs,
        AppError,
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
    // TODO: plug this error somewhere
    error = ''

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
                text: this.$t('tx.mined'),
                link: '/txs'
            },
            {
                text: this.$tc('tx.hash', 1),
                hash: this.txRef
            }
        ]
    }
}
</script>
