<template>
    <div
        :class="{
            'pa-4 pa-sm-6 fill-height v-card v-card--variant-elevated rounded-xl elevation-1': props.isOverview
        }"
    >
        <v-card-title v-if="props.isOverview || props.newRewards" class="card-title d-flex justify-space-between align-center mb-5 px-0">
            <div>
                <span v-if="props.isOverview" class="text-h6 font-weight-bold">{{ headerTitle }}</span>
                <!-- Notice new update-->
                <app-new-update :icon-only="props.isOverview" :text="newRewardsText" :update-count="props.newRewards" @reload="setPage(0, true)" />
            </div>
            <template v-if="props.isOverview">
                <app-btn v-if="!smAndDown" text="More" isSmall icon="east" @click="goToAddressMiningPage"></app-btn>
                <app-btn-icon v-else icon="more_horiz" @click="goToAddressMiningPage"></app-btn-icon>
            </template>
        </v-card-title>
        <div>
            <!--Table Header-->
            <v-row class="d-none d-sm-flex text-body-1 text-info my-0">
                <v-col md="3" class="py-0"> Block # </v-col>
                <v-col md="3" class="py-0"> Reward </v-col>
                <v-col md="3" class="py-0"> Balance Before </v-col>
                <v-col md="3" class="py-0"> Balance After </v-col>
            </v-row>
            <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
            <div v-if="!initialLoad && renderState.renderTable" class="p-ten-top">
                <template v-if="rewards.length > 0">
                    <div v-for="(reward, index) in rewards" :key="index">
                        <minor-blocks-table-row :reward="reward" />
                    </div>
                    <app-intersect v-if="!props.isOverview && hasMore" @intersect="loadMoreData">
                        <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                    </app-intersect>
                </template>
                <template v-if="rewards.length < 1 && !isLoadingRewards">
                    <app-no-result text="This address does not have any mining history" class="mt-4 mt-sm-6"></app-no-result>
                </template>
            </div>
            <template v-else>
                <div v-for="i in props.maxItems" :key="i">
                    <div class="skeleton-box rounded-xl mt-5" style="height: 24px"></div>
                </div>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import MinorBlocksTableRow from '@module/address/components/TableRowMinerRewards.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'

import {
    RewardSummaryFragment,
    RewardTransferFragment,
    useGetAddrRewardsBlockQuery,
    useGetAddrRewardsUncleQuery
} from '@module/address/apollo/AddressRewards/rewards.generated'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { ROUTE_NAME, ADDRESS_ROUTE_QUERY } from '@core/router/routesNames'
import { useAppTableRowRender } from '@core/composables/AppTableRowRender/useAppTableRowRender.composable'
const { smAndDown, mdAndDown } = useDisplay()

const MOBILE_MAX_ITEMS = 4
const state = reactive({
    isEnd: 0,
    index: 0
})

const props = defineProps({
    rewardType: {
        type: String,
        default: 'block'
    },
    addressHash: {
        type: String,
        required: true
    },
    maxItems: {
        type: Number,
        default: 6
    },
    newRewards: {
        type: Number,
        required: true
    },
    isOverview: {
        type: Boolean,
        default: false
    }
})

const enableBlockRewardsQuery = ref(false)

if (props.rewardType === 'block') {
    enableBlockRewardsQuery.value = true
} else {
    enableBlockRewardsQuery.value = false
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
    { notifyOnNetworkStatusChange: true, enabled: enableBlockRewardsQuery.value }
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
    { notifyOnNetworkStatusChange: true, enabled: !enableBlockRewardsQuery.value }
)

const addressRewards = computed<RewardSummaryFragment | undefined>(() => {
    if (props.rewardType === 'block') {
        return addressRewardsBlockQueryResult.value?.getBlockRewards
    }
    return addressRewardsUncleQueryResult.value?.getUncleRewards
})

const noResultText = computed<RewardSummaryFragment | undefined>(() => {
    if (props.rewardType === 'block') {
        return 'This address does not have any miner rewards'
    }
    return 'This address does not have any uncle rewards'
})

const newRewardsText = computed<string>(() => {
    const isPlural = props.newRewards > 1
    if (props.rewardType === 'block') {
        return isPlural ? 'New blocks' : 'New block'
    }
    return isPlural ? 'New uncles' : 'New uncle'
})

const headerTitle = computed<string>(() => {
    if (props.isOverview) {
        return 'Blocks Mined'
    }
    if (props.rewardType === 'block') {
        return 'Mined Blocks Reward'
    }
    return 'Mined Uncles Rewards'
})

/*
 * Initial load will be true only when the data is being loaded initially
 */
const initialLoad = computed<boolean>(() => {
    if (props.rewardType === 'block') {
        return !addressRewardsBlockQueryResult.value
    }
    return !addressRewardsUncleQueryResult.value
})

/**
 * Render State Tracking
 */

const rewardsLength = computed<number>(() => {
    if (!initialLoad.value && addressRewards.value) {
        return addressRewards.value?.transfers.length
    }
    return 0
})

const { renderState } = useAppTableRowRender(rewardsLength.value)

/*
 * Handle result and render on preloaded tables
 */
const rewards = computed<Array<RewardTransferFragment | null>>(() => {
    if (!initialLoad.value && addressRewards.value) {
        const start = state.index * props.maxItems
        // If on mobile screen and on overview page
        if (mdAndDown.value && props.isOverview) {
            return addressRewards.value?.transfers.slice(start, MOBILE_MAX_ITEMS)
        }
        if (props.isOverview) {
            return addressRewards.value?.transfers.slice(start, props.maxItems)
        }
        return renderState.isActive ? addressRewards.value?.transfers.slice(0, renderState.maxItems) : addressRewards.value?.transfers
    }
    return []
})

const isLoadingRewards = computed<boolean>(() => {
    return loadingAddressRewardsBlock.value || loadingAddressRewardsUncle.value
})

const hasMore = computed<boolean>(() => {
    return !!addressRewards.value && addressRewards?.value.nextKey !== null
})

const eventType = computed<AddressEventType>(() => {
    if (props.rewardType === 'block') {
        return AddressEventType.NewMinedBlock
    }
    return AddressEventType.NewMinedUncle
})

const emit = defineEmits<{
    (e: 'resetUpdateCount', eventType: AddressEventType, isReset: boolean): void
}>()

/**
 * Sets page number and fetch more data or reset state
 * @param page {Number}
 * @param reset {Boolean}
 */
const setPage = async (page: number, reset = false): Promise<boolean> => {
    try {
        if (reset) {
            state.isEnd = 0
            if (props.rewardType === 'block') {
                refetchAddressRewardsBlock()
            } else {
                refetchAddressRewardsUncle()
            }
            emit('resetUpdateCount', eventType.value, true)
        } else {
            if (page > state.isEnd && hasMore.value && addressRewards.value) {
                if (props.rewardType === 'block') {
                    await fetchMoreAddressRewardsBlock({
                        variables: {
                            hash: props.addressHash,
                            _limit: props.maxItems,
                            _nextKey: addressRewards.value.nextKey
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
                            _limit: props.maxItems,
                            _nextKey: addressRewards.value.nextKey
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
        state.index = page
        return true
    } catch (e) {
        const newE = JSON.stringify(e)
        if (!newE.toLowerCase().includes(excpInvariantViolation)) {
            throw new Error(newE)
        }
        return false
    }
}

const loadMoreData = (e: boolean): void => {
    if (addressRewards.value && e && !props.isOverview) {
        setPage(state.index + 1)
    }
}

const router = useRouter()
const goToAddressMiningPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_MINER.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_MINER[0] }
    })
}
</script>

<style lang="scss" scoped>
.card-title {
    min-height: 50px;
}
</style>
