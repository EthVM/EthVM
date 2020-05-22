<template>
    <v-card color="white" flat class="pt-3 pb-2">
        <app-table-title :title="getTitle" :has-pagination="false" :page-type="pageType" page-link="/blocks" />
        <table-blocks :max-items="MAX_ITEMS" :index="0" :is-loading="loading" :table-message="message" :block-data="blocks" :is-scroll-view="true" />
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import TableBlocks from '@app/modules/blocks/components/TableBlocks.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BigNumber from 'bignumber.js'
import { getBlocksArrayByNumber, newBlockTable } from './recentBlocks.graphql'
import { getBlocksArrayByNumber_getBlocksArrayByNumber as TypeBlocks } from './getBlocksArrayByNumber.type'

const MAX_ITEMS = 20

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        TableBlocks
    },
    apollo: {
        getBlocksArrayByNumber: {
            query: getBlocksArrayByNumber,
            variables() {
                return {
                    limit: MAX_ITEMS
                }
            },
            subscribeToMore: [
                {
                    document: newBlockTable,
                    updateQuery: (previousResult, { subscriptionData }) => {
                        if (subscriptionData.data.newBlockFeed) {
                            const prevB = previousResult.getBlocksArrayByNumber
                            const newB = subscriptionData.data.newBlockFeed
                            newB.txFail = 0
                            const index = prevB.findIndex(block => block.number === newB.number)
                            if (index != -1) {
                                prevB[index] = newB
                                return previousResult
                            }
                            return {
                                __typename: 'BlockSummary',
                                getBlocksArrayByNumber: [newB, ...prevB]
                            }
                        }
                    }
                }
            ],

            result({ data }) {
                if (data && data.getBlocksArrayByNumber) {
                    this.error = '' // clear the error
                    this.initialLoad = false
                    if (this.pageType === 'home') {
                        if (this.getBlocksArrayByNumber[0].number - this.getBlocksArrayByNumber[1].number > 1) {
                            this.$apollo.queries.getBlocksArrayByNumber.refetch()
                        }
                    } else {
                        this.error = this.error || this.$i18n.t('message.err')
                    }
                }
            }
        }
    }
})
export default class RecentBlocks extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop({ type: String, default: 'home' }) pageType!: string

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    MAX_ITEMS = MAX_ITEMS
    initialLoad = true
    error = ''
    syncing?: boolean = false
    getBlocksArrayByNumber!: TypeBlocks

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get blocks(): TypeBlocks | [] {
        if (this.getBlocksArrayByNumber && this.getBlocksArrayByNumber !== null) {
            return this.getBlocksArrayByNumber
        }
        return []
    }

    get message() {
        return ''
    }

    get getTitle(): string {
        const titles = {
            blocks: this.$i18n.t('block.last'),
            address: this.$i18n.t('block.mined'),
            home: this.$i18n.t('block.last')
        }
        return titles[this.pageType]
    }
    get loading(): boolean {
        // if (this.pageType !== 'home')
        return this.initialLoad
    }
    get skipSubscriptions() {
        return this.pageType !== 'home'
    }
    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    // @Watch('newBlock')
    // onNewBlockChanged(newVal: number, oldVal: number): void {
    //     if (newVal && newVal != oldVal) {
    //         this.$apollo.queries.getBlocksArrayByNumber.refetch({
    //             updateQuery: (previousResult, { fetchMoreResult }) => {
    //                 return {
    //                     getBlocksArrayByNumber: {
    //                         __typename: previousResult.getBlocksArrayByNumber.__typename,
    //                         tags: [...fetchMoreResult.getBlocksArrayByNumber, ...previousResult.getBlocksArrayByNumber]
    //                     }
    //                 }
    //             }
    //         })
    //     }
    // }
    /*
    ===================================================================================
      LifeCycle:
    ===================================================================================
    */
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
