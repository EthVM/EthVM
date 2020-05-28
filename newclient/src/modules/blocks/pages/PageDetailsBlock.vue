<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
        <block-details v-if="isValid" :block-ref="blockRef" />

        <!--
    =====================================================================================
      TX TABLE
    =====================================================================================
    -->
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import BlockDetails from '@app/modules/blocks/handlers/BlockDetails/BlockDetails.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { eth } from '@app/core/helper'
import { Detail, Crumb } from '@app/core/components/props'
import { Vue, Component, Prop } from 'vue-property-decorator'
import BN from 'bignumber.js'

const MAX_TXS = 10

@Component({
    components: {
        AppBreadCrumbs,
        AppDetailsList,
        BlockDetails,
        TableTxs
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

    error = ''

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    created() {
        // Check that current block ref is valid one

        if (!this.isValid) {
            this.error = this.$i18n.t('message.invalid.block').toString()
            return
        }

        window.scrollTo(0, 0)
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get hasError(): boolean {
        return this.error !== ''
    }

    get isValid(): boolean {
        return eth.isValidHash(this.blockRef) || eth.isValidBlockNumber(this.blockRef)
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
}
</script>
