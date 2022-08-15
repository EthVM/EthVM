<template>
    <!--
    =====================================================================================
      TX DETAILS LIST
    =====================================================================================
    -->

    <app-details-list :details="blockDetails" :is-loading="isLoading" :max-items="9" is-block>
        <template #title>
            <block-details-title
                :curr-block="currBlockNumber"
                :next-block="nextBlock"
                :prev-block="previousBlock"
                :uncles="uncleHashes"
                :loading="isLoading"
                :is-subscribed="subscriptionEnabled"
            />
            <v-divider class="lineGrey" />
        </template>
    </app-details-list>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, watch } from 'vue'
import BN from 'bignumber.js'
import AppDetailsList from '@/core/components/AppDetailsList.vue'
import BlockDetailsTitle from '@module/block/components/BlockDetailsTitle.vue'
import { Detail } from '@/core/components/props'
import {
    BlockDetailsFragment as BlockDetailsType,
    GetBlockByHashDocument,
    GetBlockByNumberDocument,
    useGetLastBlockNumberQuery
} from '@/modules/block/apollo/BlockDetails/blockDetails.generated'
import { ErrorMessageBlock } from '@/modules/block/models/ErrorMessagesForBlock'
import { excpBlockNotMined } from '@/apollo/errorExceptions'
import { FormattedNumber, formatNumber, formatVariableUnitEthValue } from '@/core/helper/number-format-helper'
import { useNewBlockFeedSubscription } from '@core/composables/NewBlock/newBlockFeed.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'
import { useQuery } from '@vue/apollo-composable'

const props = defineProps({
    blockRef: String,
    isHash: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['errorDetails', 'isMined', 'setBlockNumber'])

const blockDetails = computed<Detail[]>(() => {
    const details: Detail[] = [
        {
            title: 'Height',
            detail: formatNumber(blockDetailsData.value?.summary.number)
        },
        {
            title: 'Hash',
            detail: blockDetailsData.value?.hash,
            copy: true,
            mono: true
        },
        {
            title: 'Parent Hash',
            detail: blockDetailsData.value?.parentHash,
            link: `/block/hash/${blockDetailsData.value?.parentHash}`,
            copy: true,
            mono: true
        },
        {
            title: 'Timestamp',
            detail: new Date(blockDetailsData.value?.summary.timestamp * 1e3).toString()
        },
        {
            title: 'Miner',
            detail: blockDetailsData.value?.summary.miner,
            link: `/address/${blockDetailsData.value?.summary.miner}`,
            copy: true,
            mono: true,
            toChecksum: true
        },
        {
            title: 'Total Rewards',
            detail: `${rewards.value.value} ${rewards.value.unit}`,
            tooltip: rewards.value.tooltipText ? `${rewards.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Txs Fees',
            detail: `${transactionFees.value.value} ${transactionFees.value.unit}`,
            tooltip: transactionFees.value.tooltipText ? `${transactionFees.value.tooltipText} ETH` : undefined
        },

        {
            title: 'Uncle Reward',
            detail: `${uncleRewards.value.value} ${uncleRewards.value.unit}`,
            tooltip: uncleRewards.value.tooltipText ? `${uncleRewards.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Transactions',
            detail: transactionsCount.value
        },
        {
            title: 'Difficulty',
            detail: formatNumber(new BN(blockDetailsData.value?.difficulty).toNumber())
        },
        {
            title: 'Total Difficulty',
            detail: formatNumber(new BN(blockDetailsData.value?.totalDifficulty).toNumber())
        },
        {
            title: 'Size',
            detail: `${formatNumber(blockDetailsData.value?.size)} Bytes`
        },
        {
            title: 'Nonce',
            detail: formatNumber(new BN(blockDetailsData.value?.nonce).toNumber())
        },
        {
            title: 'State Root',
            detail: blockDetailsData.value?.stateRoot,
            mono: true
        },
        {
            title: 'Extra Data',
            detail: blockDetailsData.value?.extraData,
            mono: true
        },

        {
            title: 'Gas Limit',
            detail: formatNumber(blockDetailsData.value?.gasLimit)
        },
        {
            title: 'Gas Used',
            detail: formatNumber(blockDetailsData.value?.gasUsed)
        },
        {
            title: 'Logs',
            detail: blockDetailsData.value?.logsBloom,
            mono: true
        },
        {
            title: 'Transactions Root',
            detail: blockDetailsData.value?.transactionsRoot,
            mono: true
        },
        {
            title: 'Receipts Root',
            detail: blockDetailsData.value?.receiptsRoot,
            mono: true
        },
        {
            title: 'Uncles SHA3',
            detail: blockDetailsData.value?.sha3Uncles,
            mono: true
        }
    ]
    return details
})

interface ModuleState {
    hasError: boolean
}

const state: ModuleState = reactive({
    hasError: false
})

const subscriptionEnabled = ref(false)

/**
 * Start apollo subscription
 */
const blockDetailsQueryVariable = computed<string | number>(() => {
    return props.isHash ? props.blockRef : parseInt(props.blockRef)
})

const {
    result: blockDetailsResult,
    onResult: onBlockDetailsLoaded,
    onError: onBlockDetailsError,
    loading: loadingBlockDetails,
    refetch: refetchBlockDetails
} = useQuery(
    () => (props.isHash ? GetBlockByHashDocument : GetBlockByNumberDocument),
    () => ({
        blockRef: blockDetailsQueryVariable.value
    }),
    { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only', enabled: !subscriptionEnabled.value }
)

onBlockDetailsLoaded(() => {
    if (blockDetailsData.value) {
        emit('setBlockNumber', blockDetailsData.value.summary.number.toString())
        emit('isMined', true)
        emitErrorState(false)
    }
})

onBlockDetailsError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.toLowerCase().includes(excpBlockNotMined) && !subscriptionEnabled.value && !props.isHash) {
        subscriptionEnabled.value = true
    } else {
        emitErrorState(true)
    }
})

const blockDetailsData = computed<BlockDetailsType>(() => {
    return props.isHash ? blockDetailsResult?.value?.getBlockByHash : blockDetailsResult?.value?.getBlockByNumber
})

const { onResult: onNewBlockLoaded } = useNewBlockFeedSubscription(() => ({
    enabled: subscriptionEnabled.value
}))

onNewBlockLoaded(data => {
    if (new BN(data.data.newBlockFeed.number).isGreaterThanOrEqualTo(new BN(props.blockRef))) {
        subscriptionEnabled.value = false
        refetchBlockDetails()
    }
})

const isLoading = computed<boolean>(() => {
    return state.hasError ? state.hasError : loadingBlockDetails.value || subscriptionEnabled.value
})

const uncleHashes = computed<(string | null)[]>(() => {
    return blockDetailsData.value && blockDetailsData.value?.summary.uncles ? blockDetailsData.value?.summary.uncles : []
})

const rewards = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(blockDetailsData.value?.summary.rewards.total))
})

const uncleRewards = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(blockDetailsData.value?.summary.rewards.uncles))
})

const transactionFees = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(blockDetailsData.value?.summary.rewards.txFees))
})

const transactionsCount = computed<string>(() => {
    const failedString = blockDetailsData.value?.summary.txFail > 0 ? `, ${formatNumber(blockDetailsData.value?.summary.txFail)} Failed Txs` : ''
    return `${formatNumber(blockDetailsData.value?.summary.txCount)} ${failedString}`.trim()
})

const { newBlockNumber } = useBlockSubscription()
const { result: lastBlockNumberResult, loading: loadingLastBlockNumber } = useGetLastBlockNumberQuery()
const lastBlock = computed<number | undefined>(() => {
    if (!loadingLastBlockNumber.value) {
        const latestBlockNum = lastBlockNumberResult.value ? lastBlockNumberResult.value?.getLatestBlockInfo.number : undefined
        return newBlockNumber.value ? newBlockNumber.value : latestBlockNum
    }
    return undefined
})

const nextBlock = computed<string>(() => {
    const next = blockDetailsData.value ? blockDetailsData.value.summary.number + 1 : -1
    if (lastBlock.value && lastBlock.value >= next) {
        return `/block/number/${next}`
    }
    return ''
})

const previousBlock = computed<string>(() => {
    const prev = blockDetailsData.value ? blockDetailsData.value.summary.number - 1 : -1
    if (prev >= 0) {
        return `/block/number/${prev}`
    }
    return ''
})

const currBlockNumber = computed<number | null>(() => {
    return blockDetailsData.value && blockDetailsData.value.summary ? blockDetailsData.value.summary.number.toString() : null
})

/**
 * Emit error to Sentry
 * @param val {Boolean}
 * @param hashNotFound {Boolean}
 */
const emitErrorState = (val: boolean): void => {
    state.hasError = val
    emit('errorDetails', state.hasError, ErrorMessageBlock.details)
}

onMounted(() => {
    refetchBlockDetails()
})

watch(
    () => props.blockRef,
    data => {
        refetchBlockDetails({ blockRef: parseInt(data) })
    }
)
</script>
