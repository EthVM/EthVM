<template>
    <v-container grid-list-lg class="mb-0">
        <app-bread-crumbs :new-items="crumbs" />
        <!--
    =====================================================================================
      DETAILS LIST
    =====================================================================================
    -->
        <v-layout row wrap justify-start class="mb-4">
            <v-flex xs12>
                <!-- <app-details-list :details="blockDetails" :is-loading="loading" :error="error" :max-items="8" class="mb-4">
                    <template v-slot:title>
                        <block-details-title :next-block="nextBlock" :prev-block="previousBlock" :uncles="uncleHashes" />
                    </template>
                </app-details-list> -->
                <p>Block Details</p>
            </v-flex>
        </v-layout>
        <!--
    =====================================================================================
      TX TABLE
    =====================================================================================
    -->
        <!-- <v-layout v-if="!hasError" row wrap justify-start class="mb-4">
            <v-flex xs12>
                <table-txs :block-number="blockNumber" :block-hash="blockHash" :page-type="'block'" :max-items="max" class="mt-3" />
            </v-flex>
        </v-layout> -->
    </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import BlockDetailsTitle from '@app/modules/blocks/components/BlockDetailsTitle.vue'
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
        BlockDetailsTitle,
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

        if (!this.blockNumber) {
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

    get blockNumber(): BN | null {
        const { blockRef } = this
        return !eth.isValidHash(blockRef) && eth.isValidBlockNumber(blockRef) ? new BN(blockRef) : null
    }

    get hasError(): boolean {
        return this.error !== ''
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
        if (!eth.isValidHash(this.blockRef) && !eth.isValidBlockNumber(this.blockRef)) {
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
