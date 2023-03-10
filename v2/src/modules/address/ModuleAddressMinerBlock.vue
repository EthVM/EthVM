<template>
    <div>
        <v-row class="my-4">
            <div class="mr-3">
                <v-btn
                    color="textPrimary"
                    :variant="state.tab === minerRoutes[0] ? 'flat' : 'outlined'"
                    density="compact"
                    rounded="pill"
                    class="px-2"
                    height="24"
                    @click="setMinerTab(minerRoutes[0])"
                >
                    Block rewards
                </v-btn>
            </div>
            <div class="mx-3">
                <v-btn
                    color="textPrimary"
                    :variant="state.tab === minerRoutes[1] ? 'flat' : 'outlined'"
                    density="compact"
                    rounded="pill"
                    class="px-2"
                    height="24"
                    @click="setMinerTab(minerRoutes[1])"
                >
                    Uncle rewards
                </v-btn>
            </div>
        </v-row>
        <div>
            <div>
                <!--Table Header-->
                <v-row class="d-none d-sm-flex text-body-1 text-info mt-2 mt-sm-5 mb-1">
                    <v-col md="3" class="py-0"> Block # </v-col>
                    <v-col md="3" class="py-0"> Reward </v-col>
                    <v-col md="3" class="py-0"> Balance Before </v-col>
                    <v-col md="3" class="py-0"> Balance After </v-col>
                </v-row>
                <v-divider class="my-0 mt-4 mx-n4 mx-sm-n6" />
                <div v-if="!initialLoad && !isLoadingRewards" class="p-ten-top">
                    <template v-if="rewards.length > 0">
                        <div v-for="(reward, index) in currentPageData" :key="index">
                            <minor-blocks-table-row v-if="reward" :reward="reward" />
                        </div>
                    </template>
                    <template v-if="rewards.length < 1">
                        <app-no-result :text="noResultText" class="mt-4 mt-sm-6"></app-no-result>
                    </template>
                </div>
                <div v-else style="padding-top: 6px">
                    <div v-for="item in 10" :key="item">
                        <div class="skeleton-box rounded-xl my-5" style="height: 44px"></div>
                    </div>
                </div>
                <template v-if="showPagination">
                    <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" />
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MinorBlocksTableRow from '@module/address/components/TableRowMinerRewards.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import AppPagination from '@core/components/AppPagination.vue'

import { computed, reactive } from 'vue'

import {
    RewardSummaryFragment,
    RewardTransferFragment,
    useGetAddrRewardsBlockQuery,
    useGetAddrRewardsUncleQuery
} from '@module/address/apollo/AddressRewards/rewards.generated'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { AddressEventType } from '@/apollo/types'
import { ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { useAddressUpdate } from '@core/composables/AddressUpdate/addressUpdate.composable'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const minerRoutes = ADDRESS_ROUTE_QUERY.Q_MINER

interface ComponentState {
    isEnd: number
    tab: string
    refetching: boolean
}

const state: ComponentState = reactive({
    isEnd: 1,
    tab: minerRoutes[0],
    refetching: false
})

const props = defineProps({
    addressHash: {
        type: String,
        required: true
    }
})

const { resetCount } = useAddressUpdate(props.addressHash)

const enableBlockRewardsQuery = computed<boolean>(() => {
    return state.tab === minerRoutes[0]
})

const setMinerTab = (tabName: string) => {
    state.tab = tabName
}

const {
    result: addressRewardsBlockQueryResult,
    loading: loadingAddressRewardsBlock,
    fetchMore: fetchMoreAddressRewardsBlock,
    refetch: refetchAddressRewardsBlock
} = useGetAddrRewardsBlockQuery(
    () => ({
        hash: props.addressHash,
        _limit: 10
    }),
    () => ({ notifyOnNetworkStatusChange: true, enabled: enableBlockRewardsQuery.value })
)

const {
    result: addressRewardsUncleQueryResult,
    loading: loadingAddressRewardsUncle,
    fetchMore: fetchMoreAddressRewardsUncle,
    refetch: refetchAddressRewardsUncle
} = useGetAddrRewardsUncleQuery(
    () => ({
        hash: props.addressHash,
        _limit: 10
    }),
    () => ({ notifyOnNetworkStatusChange: true, enabled: !enableBlockRewardsQuery.value })
)

const addressRewards = computed<RewardSummaryFragment | undefined>(() => {
    if (state.tab === minerRoutes[0]) {
        return addressRewardsBlockQueryResult.value?.getBlockRewards
    }
    return addressRewardsUncleQueryResult.value?.getUncleRewards
})

const noResultText = computed<string>(() => {
    if (state.tab === minerRoutes[0]) {
        return 'This address does not have any block rewards'
    }
    return 'This address does not have any uncle rewards'
})

/*
 * Initial load will be true only when the data is being loaded initially
 */
const initialLoad = computed<boolean>(() => {
    if (state.tab === minerRoutes[0]) {
        return !addressRewardsBlockQueryResult.value
    }
    return !addressRewardsUncleQueryResult.value
})

/*
 * Handle result and render on preloaded tables
 */
const rewards = computed<Array<RewardTransferFragment | null>>(() => {
    if (!initialLoad.value && addressRewards.value) {
        return addressRewards.value?.transfers
    }
    return []
})

const { numberOfPages, pageData: currentPageData, setPageNum } = useAppPaginate(rewards)

const isLoadingRewards = computed<boolean>(() => {
    return loadingAddressRewardsBlock.value || loadingAddressRewardsUncle.value
})

const hasMore = computed<boolean>(() => {
    return !!addressRewards.value && addressRewards?.value.nextKey !== null
})

const showPagination = computed<boolean>(() => {
    return hasMore.value && !initialLoad.value && !state.refetching && rewards.value.length > 0
})

const eventType = computed<AddressEventType>(() => {
    if (state.tab === minerRoutes[0]) {
        return AddressEventType.NewMinedBlock
    }
    return AddressEventType.NewMinedUncle
})

/**
 * Sets page number and fetch more data or reset state
 * @param page {Number}
 * @param reset {Boolean}
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    try {
        if (reset) {
            state.isEnd = 1
            state.refetching = true
            if (state.tab === minerRoutes[0]) {
                await refetchAddressRewardsBlock()
            } else {
                await refetchAddressRewardsUncle()
            }
            state.refetching = false
            setPageNum(1)
            resetCount(eventType.value, true)
        } else {
            if (page > state.isEnd && hasMore.value) {
                if (state.tab === minerRoutes[0]) {
                    await fetchMoreAddressRewardsBlock({
                        variables: {
                            hash: props.addressHash,
                            _limit: ITEMS_PER_PAGE,
                            _nextKey: addressRewards.value?.nextKey
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            state.isEnd = page
                            const newT = fetchMoreResult?.getBlockRewards.transfers
                            const prevT = previousResult.getBlockRewards.transfers
                            const transfers = newT ? [...prevT, ...newT] : [...prevT]
                            return {
                                getBlockRewards: {
                                    nextKey: fetchMoreResult?.getBlockRewards.nextKey,
                                    transfers,
                                    __typename: fetchMoreResult?.getBlockRewards.__typename
                                }
                            }
                        }
                    })
                } else {
                    await fetchMoreAddressRewardsUncle({
                        variables: {
                            hash: props.addressHash,
                            _limit: ITEMS_PER_PAGE,
                            _nextKey: addressRewards.value?.nextKey
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                            state.isEnd = page
                            const newT = fetchMoreResult?.getUncleRewards.transfers
                            const prevT = previousResult.getUncleRewards.transfers
                            const transfers = newT ? [...prevT, ...newT] : [...prevT]
                            return {
                                getUncleRewards: {
                                    nextKey: fetchMoreResult?.getUncleRewards.nextKey,
                                    transfers,
                                    __typename: fetchMoreResult?.getUncleRewards.__typename
                                }
                            }
                        }
                    })
                }
            }
        }
        setPageNum(page)
        return true
    } catch (e) {
        const newE = JSON.stringify(e)
        if (!newE.toLowerCase().includes(excpInvariantViolation)) {
            throw new Error(newE)
        }
        return false
    }
}

const loadMoreData = (pageNum: number): void => {
    if (addressRewards.value) {
        setPage(pageNum)
    }
}
</script>

<style lang="scss" scoped>
.card-title {
    min-height: 50px;
}
</style>
