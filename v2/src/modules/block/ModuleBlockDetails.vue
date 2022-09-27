<template>
    <block-details
        :block-details="blockDetails"
        :timestamp="timestamp"
        :curr-block-number="currBlockNumber"
        :next-block="nextBlock"
        :previous-block="previousBlock"
        :is-loading="isLoading"
    />
    <v-card variant="elevated" elevation="1" rounded="xl" class="mt-5">
        <v-tabs v-model="state.tab" color="primary" end>
            <v-tab :value="routes[0]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">Transactions</v-tab>
            <v-tab :value="routes[1]" class="py-3 text-h5 text-capitalize rounded-b-xl" @click="changeRoute">More</v-tab>
        </v-tabs>
        <block-txs
            v-show="state.tab === routes[0]"
            :max-items="10"
            :block-ref="props.blockRef"
            :is-hash="isHash"
            :is-mined="state.isMined"
            page-type="blockDetails"
        />
        <more-block-details v-show="state.tab === routes[1]" :block-details="blockDetails" :uncle-hashes="uncleHashes" :is-loading="isLoading" />
    </v-card>
</template>

<script setup lang="ts">
import AppDetailsList from '@/core/components/AppDetailsList.vue'
import BlockDetailsTitle from '@module/block/components/BlockDetails.vue'
import BlockDetails from '@module/block/components/BlockDetails.vue'
import MoreBlockDetails from '@module/block/components/RecentBlocks/MoreBlockDetails.vue'
import BlockTxs from '@module/txs/ModuleTxs.vue'
import { reactive, computed, ref, onMounted, watch } from 'vue'
import BN from 'bignumber.js'
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
import { timeAgo, eth } from '@core/helper'
import { useRoute, useRouter } from 'vue-router'
import { Q_BLOCK_DETAILS } from '@core/router/routesNames'
const routes = Q_BLOCK_DETAILS

const props = defineProps({
    blockRef: String,
    isHash: {
        type: Boolean,
        default: false
    },
    tab: String
})

const emit = defineEmits(['errorDetails', 'isMined', 'setBlockNumber'])

const blockDetails = computed<{ [key: string]: Detail }>(() => {
    const details: { [key: string]: Detail } = {
        height: {
            title: 'Height',
            detail: formatNumber(blockDetailsData.value?.summary.number)
        },
        hash: {
            title: 'Hash',
            detail: blockDetailsData.value?.hash
        },
        parentHash: {
            title: 'Parent Hash',
            detail: blockDetailsData.value?.parentHash,
            link: `/block/hash/${blockDetailsData.value?.parentHash}`
        },
        miner: {
            title: 'Miner',
            detail: blockDetailsData.value?.summary.miner,
            link: `/address/${blockDetailsData.value?.summary.miner}`
        },
        totalRewards: {
            title: 'Total Rewards',
            detail: `${rewards.value.value} ${rewards.value.unit}`,
            tooltip: rewards.value.tooltipText ? `${rewards.value.tooltipText} ETH` : undefined
        },
        txsFees: {
            title: 'Txs Fees',
            detail: `${transactionFees.value.value} ${transactionFees.value.unit}`,
            tooltip: transactionFees.value.tooltipText ? `${transactionFees.value.tooltipText} ETH` : undefined
        },
        uncleReward: {
            title: 'Uncle Reward',
            detail: `${uncleRewards.value.value} ${uncleRewards.value.unit}`,
            tooltip: uncleRewards.value.tooltipText ? `${uncleRewards.value.tooltipText} ETH` : undefined
        },
        transactions: {
            title: 'Transactions',
            detail: transactionsCount.value
        },
        difficulty: {
            title: 'Difficulty',
            detail: formatNumber(new BN(blockDetailsData.value?.difficulty).toNumber())
        },
        totalDifficulty: {
            title: 'Total Difficulty',
            detail: formatNumber(new BN(blockDetailsData.value?.totalDifficulty).toNumber())
        },
        blockSize: {
            title: 'Size',
            detail: `${formatNumber(blockDetailsData.value?.size)} Bytes`
        },
        nonce: {
            title: 'Nonce',
            detail: formatNumber(new BN(blockDetailsData.value?.nonce).toNumber())
        },
        stateRoot: {
            title: 'State Root',
            detail: blockDetailsData.value?.stateRoot
        },
        extraData: {
            title: 'Extra Data',
            detail: blockDetailsData.value?.extraData
        },
        gasLimit: {
            title: 'Gas Limit',
            detail: formatNumber(blockDetailsData.value?.gasLimit)
        },
        gasUsed: {
            title: 'Gas Used',
            detail: formatNumber(blockDetailsData.value?.gasUsed)
        },
        logs: {
            title: 'Logs',
            detail: blockDetailsData.value?.logsBloom
        },
        transactionsRoot: {
            title: 'Transactions Root',
            detail: blockDetailsData.value?.transactionsRoot
        },
        receiptsRoot: {
            title: 'Receipts Root',
            detail: blockDetailsData.value?.receiptsRoot
        },
        unclesSHA3: {
            title: 'Uncles SHA3',
            detail: blockDetailsData.value?.sha3Uncles
        }
    }
    return details
})

const timestamp = computed<string>(() => {
    if (blockDetailsData.value) {
        const date = new Date(blockDetailsData.value?.summary.timestamp * 1e3).toLocaleDateString()
        const time = new Date(blockDetailsData.value?.summary.timestamp * 1e3).toTimeString().split('GMT')[0]
        const timeago = timeAgo(new Date(blockDetailsData.value?.summary.timestamp * 1e3))
        const [month, day, year] = date.split('/')
        return `${year}-${month}-${day}, ${time}, ${timeago}`
    }
    return ''
})

interface ModuleState {
    hasError: boolean
    tab: string
    isMined: boolean
    blockNumber: string
}

const state: ModuleState = reactive({
    hasError: false,
    tab: routes[0],
    isMined: true,
    blockNumber: ''
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
        state.blockNumber = blockDetailsData.value.summary.number.toString()
        state.isMined = true
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
    if (data.data) {
        if (new BN(data.data.newBlockFeed.number).isGreaterThanOrEqualTo(new BN(props.blockRef))) {
            subscriptionEnabled.value = false
            refetchBlockDetails()
        }
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

const currBlockNumber = computed<string | null>(() => {
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

const router = useRouter()
const route = useRoute()
/**
 * Sets route query if new tab is selected
 */
const changeRoute = () => {
    if (route.query.t !== state.tab) {
        router.push({
            query: { t: state.tab }
        })
    }
}

onMounted(() => {
    refetchBlockDetails()

    if (props.tab) {
        state.tab = props.tab
    }
})

watch(
    () => props.blockRef,
    data => {
        refetchBlockDetails({ blockRef: parseInt(data) })
    }
)
</script>
