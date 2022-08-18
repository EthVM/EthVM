<template>
    <v-card :variant="!isOverview ? 'flat' : 'elevated'" :elevation="isOverview ? 1 : 0" rounded="xl" class="py-4 px-8 pa-md-6">
        <v-card-title class="d-flex justify-space-between align-center mb-5 px-0">
            <div>
                <span class="text-h6">{{ headerTitle }}</span>
                <!-- Notice new update-->
                <app-new-update :icon-only="isOverview" :text="newRewardsText" :update-count="props.newRewards" @reload="setPage(0, true)" />
            </div>
            <app-paginate-has-more
                v-if="rewards.length > 0 && !props.isOverview"
                :has-more="hasMore"
                :current-page="state.index"
                :loading="isLoadingRewards"
                @newPage="setPage"
            />
            <app-btn v-else text="More" isSmall icon="east" @click="goToAddressMiningPage"></app-btn>
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0">
                <v-col md="3" class="text-body-1 text-info py-0 pl-0"> Block # </v-col>
                <v-col md="3" class="text-body-1 text-info py-0"> Reward </v-col>
                <v-col md="3" class="text-body-1 text-info py-0"> Balance Before </v-col>
                <v-col md="3" class="text-body-1 text-info py-0 pr-0"> Balance After </v-col>
            </v-row>
            <v-divider class="mt-4 mb-0" />
            <template v-if="isLoadingRewards">
                <div v-for="item in 10" :key="item" class="my-2">
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="20" class="my-4 mx-2" />
                    <v-divider />
                </div>
            </template>
            <template v-else>
                <template v-if="rewards.length > 0">
                    <v-row v-for="(reward, index) in rewards" :key="index" class="my-5 mx-0 px-0 text-subtitle-2 font-weight-regular" align="center">
                        <v-col md="3" class="py-0 pl-0">
                            <router-link :to="`/block/number/${reward.transfer.block}`" class="text-link"> {{ reward.transfer.block }}</router-link>
                            <p class="text-grey-darken-1">
                                {{ timeAgo(new Date(reward.transfer.timestamp) * 1e3) }}
                            </p>
                        </v-col>
                        <v-col md="3" class="py-0">
                            <v-row>
                                + {{ getMiningReward(reward).value }} ETH
                                <!--                                <app-tooltip v-if="getMiningReward(reward).tooltipText" :text="`${getMiningReward(reward).tooltipText} ETH`"></app-tooltip>-->
                            </v-row>
                        </v-col>
                        <v-col md="3" class="py-0"> {{ getRewardBalanceBefore(reward).value }} ETH </v-col>
                        <v-col md="3" class="py-0 pr-0"> {{ getRewardBalanceAfter(reward).value }} ETH </v-col>
                    </v-row>
                </template>
                <template v-else>
                    <p class="text-h4 text-center my-2">No mining history available for this address</p>
                </template>
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
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import { excpInvariantViolation } from '@/apollo/errorExceptions'
import { timeAgo } from '@core/helper'
import { formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
import BN from 'bignumber.js'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'

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

const getMiningReward = (reward: RewardTransferFragment): FormattedNumber | null => {
    if (reward) {
        const _reward = new BN(reward.value)
        return formatNonVariableEthValue(_reward)
    }
    return null
}

const getRewardBalanceBefore = (reward: RewardTransferFragment): FormattedNumber => {
    if (reward.stateDiff && reward.stateDiff.to) {
        return formatNonVariableEthValue(new BN(reward.stateDiff.to.before))
    }
    return { value: '0' }
}

const getRewardBalanceAfter = (reward: RewardTransferFragment): FormattedNumber => {
    if (reward.stateDiff && reward.stateDiff.to) {
        return formatNonVariableEthValue(new BN(reward.stateDiff.to.after))
    }
    return { value: '0' }
}

const router = useRouter()
const goToAddressMiningPage = (): void => {
    router.push(`/address/${props.addressHash}/adr-miner-info?t=blocks`)
}
</script>
