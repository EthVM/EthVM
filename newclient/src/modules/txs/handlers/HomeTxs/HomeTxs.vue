<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="$t('tx.last')" :has-pagination="false" page-type="home" page-link="/txs" />
        <table-txs :max-items="MAX_ITEMS" :index="0" :is-loading="initialLoad" :table-message="message" :txs-data="transactions" :is-scroll-view="true" />
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { getBlockTransfers } from './queryBlockTransfers.graphql'
import {
    getBlockTransfers_getBlockTransfers as TypeBlockTransfers,
    getBlockTransfers_getBlockTransfers_transfers as TypeTransfers
} from './getBlockTransfers.type'

const MAX_ITEMS = 20

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        TableTxs
    },
    apollo: {
        getBlockTransfers: {
            query: getBlockTransfers,
            result({ data }) {
                if (data && data.getBlockTransfers) {
                    this.error = '' // clear the error
                    this.initialLoad = false
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

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    MAX_ITEMS = MAX_ITEMS
    initialLoad = true
    error = ''
    syncing?: boolean = false
    getBlockTransfers!: TypeBlockTransfers

    /*
    ===================================================================================
      Lifecycle
    ===================================================================================
    */

    get transactions(): (TypeTransfers | null)[] | [] {
        if (this.getBlockTransfers && this.getBlockTransfers.transfers !== null) {
            return this.getBlockTransfers.transfers
        }
        return []
    }

    get message() {
        return ''
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('newBlock')
    onNewBlockChanged(newVal: number, oldVal: number): void {
        if (newVal && newVal != oldVal) {
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
