<template>
    <v-card color="white" flat class="pb-2">
        <app-table-title :title="getTitle" :has-pagination="showPagination" :page-type="pageType" page-link="">
            <!-- Notice new update-->
            <template #update>
                <app-new-update :text="updateText" :update-count="newRewards" @reload="setPage(0, true)" />
            </template>
            <template v-if="showPagination && !initialLoad" #pagination>
                <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
            </template>
        </app-table-title>
        <table-txs :max-items="maxItems" :index="index" :is-loading="loading" :txs-data="rewards" :is-scroll-view="false" table-message="">
            <template #header>
                <table-address-rewards-header :is-genesis="isGenesis" hidden-sm-and-down />
            </template>
            <template #rows>
                <v-card v-for="(i, index) in rewards" :key="index" class="transparent" flat>
                    <table-address-rewards-row v-if="i !== null" :reward="i" :reward-type="rewardsType" />
                </v-card>
            </template>
        </table-txs>
        <v-layout
            v-if="showPagination && !initialLoad"
            :justify-end="$vuetify.breakpoint.mdAndUp"
            :justify-center="$vuetify.breakpoint.smAndDown"
            row
            class="pb-1 pr-3 pl-2"
        >
            <app-paginate-has-more :has-more="hasMore" :current-page="index" :loading="loading" @newPage="setPage" />
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import AppTableTitle from '@app/core/components/ui/AppTableTitle.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import TableTxs from '@app/modules/txs/components/TableTxs.vue'
import TableAddressRewardsHeader from '@app/modules/address/components/TableAddressRewardsHeader.vue'
import TableAddressRewardsRow from '@app/modules/address/components/TableAddressRewardsRow.vue'
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getAddrRewardsBlock, getAddrRewardsUncle, getAddrRewardsGenesis } from './rewards.graphql'
import { getAddrRewardsBlock_getBlockRewards as RewardsBlockType } from './apolloTypes/getAddrRewardsBlock'
import { getAddrRewardsUncle_getUncleRewards as RewardsUncleType } from './apolloTypes/getAddrRewardsUncle'
import { getAddrRewardsGenesis_getGenesisRewards as RewardsGenesisType } from './apolloTypes/getAddrRewardsGenesis'
import { RewardSummary_transfers as RewardType } from './apolloTypes/RewardSummary'
import AppNewUpdate from '@app/core/components/ui/AppNewUpdate.vue'
import { AddressEventType } from '@app/apollo/global/globalTypes'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { excpInvariantViolation } from '@app/apollo/exceptions/errorExceptions'

/*
  DEV NOTES:
  - add on Error
  - add messages if Error to be displayed in Table
*/

@Component({
    components: {
        AppNewUpdate,
        AppTableTitle,
        AppPaginateHasMore,
        TableTxs,
        TableAddressRewardsHeader,
        TableAddressRewardsRow
    },
    apollo: {
        getRewards: {
            query() {
                if (this.isBlock) {
                    return getAddrRewardsBlock
                }
                return this.isUncle ? getAddrRewardsUncle : getAddrRewardsGenesis
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
                    this.emitErrorState(false)
                    if (this.initialLoad) {
                        this.showPagination = this.getRewards.nextKey != null
                        this.initialLoad = false
                        if (this.getRewards.transfers.length > 0) {
                            this.emitRewards()
                        }
                    }
                } else {
                    this.emitErrorState(true)
                    this.showPagination = false
                    this.initialLoad = true
                    this.error = this.error || this.$i18n.t('message.err')
                }
            },
            error(error) {
                this.emitErrorState(true)
            }
        }
    }
})
export default class AddressRewards extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Number) maxItems!: number
    @Prop(String) address!: string
    @Prop({ type: String, default: 'block' }) rewardsType!: string
    @Prop(Number) newRewards!: number

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
    hasError = false

    /*
    ===================================================================================
      Computed
    ===================================================================================
    */

    get rewards(): any[] {
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

    get eventType(): AddressEventType {
        return this.isBlock ? AddressEventType.NEW_MINED_BLOCK : AddressEventType.NEW_MINED_UNCLE
    }
    get updateText(): string {
        const plural = this.newRewards > 1 ? 2 : 1
        return this.isBlock ? `${this.$tc('message.update.block', plural)}` : `${this.$tc('message.update.uncle', plural)}`
    }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */
    /**
     * Sets page number and fetch more data or reset state
     * @param page {Number} reset {Boolean}
     */
    async setPage(page: number, reset: boolean = false): Promise<boolean> {
        try {
            if (reset) {
                this.isEnd = 0
                this.initialLoad = true
                this.showPagination = false
                this.$apollo.queries.getRewards.refetch()
                this.$emit('resetUpdateCount', this.eventType, true)
            } else {
                if (page > this.isEnd && this.hasMore) {
                    let queryName!: string
                    if (this.isBlock) {
                        queryName = 'getBlockRewards'
                    } else {
                        queryName = this.isUncle ? 'getUncleRewards' : 'getGenesisRewards'
                    }

                    await this.$apollo.queries.getRewards.fetchMore({
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
            return true
        } catch (e) {
            const newE = JSON.stringify(e)
            if (!newE.toLowerCase().includes(excpInvariantViolation)) {
                throw new Error(newE)
            }
            return false
        }
    }
    /**
     * Emit Rewards to parent
     */
    emitRewards(): void {
        if (this.isBlock) {
            this.$emit('blockRewards', true)
        } else if (this.isUncle) {
            this.$emit('uncleRewards', true)
        } else {
            this.$emit('genesisRewards', true)
        }
    }
    /**
     * Emit error to Sentry
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorRewards', this.hasError, ErrorMessage.rewards)
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
