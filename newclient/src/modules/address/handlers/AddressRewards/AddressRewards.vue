<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
            <!-- Notice new update-->
            <!-- <template v-slot:update >
                <notice-new-block @reload="setPage(0, true)" />
            </template> -->
            <template v-slot:pagination v-if="showPagination && !initialLoad">
                <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
            </template>
        </app-table-title>
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :txs-data="transfers" :is-scroll-view="false" table-message="">
            <template #header>
                <table-address-txs-header v-if="isBlock" :address="address" />
                <table-address-tokens-header v-else :is-erc20="isUncle" :is-transfers="true" />
            </template>
            <template #rows>
                <v-card v-for="(tx, index) in transfers" :key="index" class="transparent" flat>
                    <table-address-txs-row v-if="isBlock" :tx="tx" :is-pending="false" :address="address" />
                    <table-address-transfers-row v-else :transfer="tx" :is-erc20="isUncle" :address="address" />
                </v-card>
            </template>
        </table-txs>
        <v-layout v-if="showPagination && !initialLoad" justify-end row class="pb-1 pr-3 pl-2">
            <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
// import NoticeNewBlock from '@app/modules/blocks/components/NoticeNewBlock.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressTxsHeader from '@app/modules/address/components/TableAddressTxsHeader.vue'
import TableAddressTxsRow from '@app/modules/address/components/TableAddressTxsRow.vue'
import TableAddressTokensHeader from '@app/modules/address/components/TableAddressTokensHeader.vue'
import TableAddressTransfersRow from '@app/modules/address/components/TableAddressTransfersRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { getAddrRewardsBlock, getAddrRewardsUncles, getAddrRewardsGenesis } from './rewards.graphql'
import { getAddrRewardsBlock_getBlockRewards as RewardsBlockType } from './getAddrRewardsBlock.type'
import { getAddrRewardsUncle_getUncleRewards as RewardsUncleType } from './getAddrRewardsUncle.type'
import { getAddrRewardsGenesis_getGenesisRewards as RewardsGenesisType } from './getAddrRewardsGenesis.type'
import { RewardSummary_transfers as RewardType } from './RewardSummary.type'
/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppTableTitle,
        AppPaginateHasMore,
        TableTxs,
        TableAddressTxsRow,
        TableAddressTxsHeader,
        TableAddressTokensHeader,
        TableAddressTransfersRow
    },
    apollo: {
        getRewards: {
            query() {
                if (this.isBlock) {
                    return getAddrRewardsBlock
                }
                return this.isUncle ? getAddrRewardsUncles : getAddrRewardsUncles
            },
            fetchPolicy: 'network-only',
            variables() {
                return {
                    hash: this.address,
                    _limit: this.maxItems
                }
            },
            deep: true,
            update: data => data.getBlockRewards || data.getUncleRewards || data.getGenesisRewards,
            result({ data }) {
                if (this.hasRewards) {
                    this.error = '' // clear the error
                    if (this.initialLoad) {
                        this.showPagination = this.getRewards.nextKey != null
                        this.initialLoad = false
                    }
                } else {
                    console.log('error failed no data: ', data)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                    this.$apollo.queries.getRewards.refetch()
                }
            }
        }
    }
})
export default class AddressTransers extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(String) address!: string
    @Prop({ type: String, default: 'block' }) rewardsType!: string

    /*
    ===================================================================================
     Initial Data
    ===================================================================================
    */

    error = ''
    syncing?: boolean = false
    initialLoad = true
    showPagination = false
    index = 0
    /*isEnd -  Last Index loaded */
    isEnd = 0
    pageType = 'address'
    getRewards!: RewardsBlockType | RewardsUncleType | RewardsGenesisType

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get transfers(): any[] {
        if (!this.loading && this.hasRewards) {
            const start = this.index * this.maxItems
            const end = start + this.maxItems > this.getRewards.transfers.length ? this.getRewards.transfers.length : start + this.maxItems
            return this.getRewards.transfers.slice(start, end)
        }
        return []
    }

    get getTitle(): string {
        if (this.isBlock) {
            return `${this.$t('miner.reward.block')}`
        }
        return this.isUncle ? `${this.$t('miner.reward.uncle')}` : `${this.$t('miner.reward.genesis')}`
    }

    get loading(): boolean {
        return this.$apollo.queries.getRewards.loading
    }
    get hasMore(): boolean {
        return this.getRewards && this.getRewards.nextKey != null
    }
    get hasRewards(): boolean {
        return this.getRewards && this.getRewards.transfers != null
    }

    get isBlock(): boolean {
        return this.rewardsType === 'block'
    }

    get isUncle(): boolean {
        return this.rewardsType === 'uncle'
    }

    get isGenesis(): boolean {
        return this.rewardsType === 'genesis'
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */

    setPage(page: number, reset: boolean = false): void {
        if (reset) {
            this.isEnd = 0
            this.$apollo.queries.getRewards.refetch()
        } else {
            if (page > this.isEnd && this.hasMore) {
                let queryName!: string
                if (this.isBlock) {
                    queryName = 'getBlockRewards'
                } else {
                    queryName = this.isUncle ? ' getUncleRewards' : ' getGenesisRewards'
                }

                this.$apollo.queries.getRewards.fetchMore({
                    variables: {
                        hash: this.address,
                        _limit: this.maxItems,
                        _nextKey: this.getRewards.nextKey
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                        this.isEnd = page
                        const newT = fetchMoreResult[queryName].transfers
                        const prevT = previousResult[queryName].transfers
                        return {
                            [queryName]: {
                                nextKey: fetchMoreResult[queryName].nextKey,
                                transfers: [...prevT, ...newT],
                                __typename: fetchMoreResult[queryName].__typename
                            }
                        }
                    }
                })
            }
        }

        this.index = page
    }

    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    // @Watch('newBlock')
    // onNewBlockChanged(newVal: number, oldVal: number): void {
    //     if (newVal != oldVal && this.isHome) {
    //         this.$apollo.queries.getAllEthTransfers.refresh()
    //     }
    // }
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
