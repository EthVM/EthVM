<template>
    <v-card variant="flat">
        <v-card-title>
            <div>Mined Blocks Rewards</div>
            <app-paginate-has-more :has-more="hasMore" :current-page="state.index" :loading="isLoadingRewards" @newPage="setPage" />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0 bg-primary">
                <v-col md="4"> Block # </v-col>
                <v-col md="4"> Age </v-col>
                <v-col md="4"> Reward </v-col>
            </v-row>
            <v-divider />
            <template v-if="isLoadingRewards">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="my-4 mx-2" />
                    <v-divider />
                </div>
            </template>
            <template v-else>
                <v-row v-for="(reward, index) in rewards" :key="index" class="ma-0 text-subtitle-2 font-weight-regular" align="center">
                    <v-col md="4">
                        <router-link :to="`/block/number/${reward.transfer.block}`" class="black--text"> {{ reward.transfer.block }}</router-link>
                    </v-col>
                    <v-col md="4">
                        {{ timeAgo(new Date(reward.transfer.timestamp) * 1e3) }}
                    </v-col>
                    <v-col md="4">
                        <v-row>
                            + {{ getMiningReward(reward).value }} {{ getMiningReward(reward).unit }}
                            <app-tooltip v-if="getMiningReward(reward).tooltipText" :text="`${getMiningReward(reward).tooltipText} ETH`"></app-tooltip>
                        </v-row>
                    </v-col>
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import {
    RewardSummaryFragment,
    RewardTransferFragment,
    useGetAddrRewardsBlockQuery,
    useGetAddrRewardsUncleQuery
} from '@module/address/apollo/AddressRewards/rewards.generated'
import { computed, reactive, ref, onMounted, watch } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { timeAgo } from '@core/helper'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'

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
        default: 10
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

/*
 * Handle result pagination
 */
const rewards = computed<Array<RewardTransferFragment | null>>(() => {
    if (!loadingAddressRewardsBlock.value && addressRewards.value) {
        const start = state.index * props.maxItems
        const end = start + props.maxItems > addressRewards.value?.transfers.length ? addressRewards.value?.transfers.length : start + props.maxItems
        return addressRewards.value?.transfers.slice(start, end)
    }
    return []
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

const isLoadingRewards = computed<boolean>(() => {
    return loadingAddressRewardsBlock.value || loadingAddressRewardsUncle.value
})

const hasMore = computed<boolean>(() => {
    return !!addressRewards.value && addressRewards?.value.nextKey !== null
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !!addressRewards.value && addressRewards.value.nextKey !== null
})

const emit = defineEmits<{
    (e: 'resetUpdateCount', isReset: boolean): void
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
            emit('resetUpdateCount', true)
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

const getMiningReward = (reward: RewardTransferFragment): FormattedNumber | null => {
    if (reward) {
        const _reward = new BN(reward.value)
        return formatNonVariableEthValue(_reward)
    }
    return null
}
</script>
