<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="/txs">
            <template v-slot:update v-if="!isHome && !isBlock">
                <notice-new-block @reload="setPage(0, true)" />
            </template>
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate
                    :total="totalPages"
                    :current-page="index"
                    :has-input="isBlock"
                    :has-first="isBlock"
                    :has-last="isBlock"
                    @newPage="setPage"
                /> </template
        ></app-table-title>
        <table-txs :max-items="maxItems" :index="index" :is-loading="initialLoad" :table-message="message" :txs-data="transactions" :is-scroll-view="isHome" />
        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
            <app-paginate :total="totalPages" :current-page="index" :has-input="isBlock" :has-first="isBlock" :has-last="isBlock" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getBlockTransfers } from './queryBlockTransfers.graphql'
import {
    getBlockTransfers_getBlockTransfers as TypeBlockTransfers,
    getBlockTransfers_getBlockTransfers_transfers as TypeTransfers
} from './getBlockTransfers.type'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        AppPaginate,
        TableTxs
    },
    apollo: {
        getBlockTransfers: {
            query: getBlockTransfers,
            fetchPolicy: 'network-only',
            skip() {
                return !(this.isHome || this.isBlock)
            },
            variables() {
                return this.isBlock ? { _number: parseInt(this.blockRef) } : undefined
            },
            result({ data }) {
                if (data && data.getBlockTransfers) {
                    this.error = '' // clear the error
                    this.initialLoad = false
                    if (this.isBlock) {
                        this.totalPages = Math.ceil(new BN(data.getBlockTransfers.transfers.length).div(this.maxItems).toNumber())
                    }
                } else {
                    this.error = this.error || this.$i18n.t('message.err')
                }
            },

            error({ graphQLErrors, networkError }) {
                const self = this

                if (graphQLErrors) {
                    graphQLErrors.forEach(error => {
                        switch (error.message) {
                            case 'Currently syncing':
                                // TODO handle this better with custom code or something
                                self.syncing = true
                                break
                            default:
                            // do nothing
                        }
                    })
                }

                // TODO refine
                if (networkError) {
                    this.error = this.$i18n.t('message.no-data')
                }
            }
        }
    }
})
export default class HomeTxs extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(Number) newBlock?: number
    @Prop({ type: String, default: 'home' }) pageType!: string
    @Prop(String) blockRef?: string
    @Prop({ type: Boolean, default: false }) isHash!: boolean

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    initialLoad = true
    error = ''
    syncing?: boolean = false
    getBlockTransfers!: TypeBlockTransfers
    index = 0
    totalPages = 0

    /*
    ===================================================================================
      Mounted
    ===================================================================================
    */

    get transactions(): (TypeTransfers | null)[] | [] {
        if (this.getBlockTransfers && this.getBlockTransfers.transfers !== null) {
            return this.getBlockTransfers.transfers
        }
        return []
    }

    get message(): string {
        return ''
    }

    get isHome(): boolean {
        return this.pageType === 'home'
    }

    get isBlock(): boolean {
        return this.pageType === 'blockDetails'
    }

    get getTitle(): string {
        return this.isBlock ? `${this.$t('block.txs')}` : `${this.$t('tx.last')}`
    }
    get showPagination(): boolean {
        return !this.isHome
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number): void {
        this.index = page
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('newBlock')
    onNewBlockChanged(newVal: number, oldVal: number): void {
        if (newVal != oldVal) {
            this.$apollo.queries.getBlockTransfers.refetch({
                updateQuery: (previousResult, { fetchMoreResult }) => {
                    return {
                        getBlockTransfers: {
                            __typename: previousResult.getBlockTransfers.__typename,
                            tags: [...fetchMoreResult.getBlockTransfers.transfers, ...previousResult.getBlockTransfers.transfers]
                        }
                    }
                }
            })
        }
    }
    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
    mounted() {
        if (!this.isHome) {
            this.$apollo.skipAllSubscriptions = true
        }
    }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
