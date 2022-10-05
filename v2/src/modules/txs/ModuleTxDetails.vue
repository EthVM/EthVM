<template>
    <!--
    =====================================================================================
      TX DETAILS LIST
    =====================================================================================
    -->
    <v-row justify="start">
        <v-col xs="12">
            <app-details-list has-title title="Transaction Details" :details="txDetails" :is-loading="isLoading" :max-items="7">
                <template v-if="!isLoading" #title>
                    <tx-details-title :status="titleStatus" />
                </template>
            </app-details-list>
        </v-col>
    </v-row>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
        <template v-if="loadingTransactionHash && !transactionData">Loading Hash</template>
        <template v-else>
            <div class="d-flex">
                <h2 class="text-h6 font-weight-bold mr-10">Transaction Summary</h2>
                <app-chip :text="titleStatus" :bg="titleBg" rounded="xl" />
            </div>
            <v-row class="mt-5">
                <v-col lg="6">
                    <div class="tx-info">
                        <p class="text-button mb-1">Tx Hash</p>
                        <app-transform-hash is-blue :hash="transactionData.hash" class="text-body-1" />
                        <p v-if="txStatus !== TxStatus.pending && !isReplaced" class="text-body-2 text-info mt-1">({{ timestamp }})</p>
                    </div>
                </v-col>
                <template v-if="txStatus !== TxStatus.pending && !isReplaced">
                    <v-col lg="2">
                        <div class="tx-info">
                            <p class="text-button mb-1">Block Mined</p>
                            <p class="text-body-1 text-secondary mt-1">{{ formatNumber(blockMined) }}</p>
                        </div>
                    </v-col>
                    <v-col lg="2">
                        <div class="tx-info">
                            <p class="text-button mb-1">Confirmations</p>
                            <p v-if="!loadingBlockInfo" class="text-body-1 text-secondary mt-1">{{ confirmations }}</p>
                            <div v-else class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                        </div>
                    </v-col>
                </template>
            </v-row>
            <v-row align="center" class="mt-5">
                <v-col lg="5">
                    <div class="rounded-lg bg-tableGrey pa-6">
                        <div class="tx-info">
                            <p class="text-button mb-1">From</p>
                            <div class="d-flex align-center">
                                <app-address-blockie :address="transactionData.from || ''" :size="8" class="mr-1 mr-sm-2" />
                                <app-transform-hash
                                    is-blue
                                    :hash="eth.toCheckSum(transactionData.from)"
                                    :link="`/address/${transactionData.from}`"
                                    class="text-body-1"
                                />
                            </div>
                        </div>
                    </div>
                </v-col>
                <v-icon class="mx-3">chevron_right</v-icon>
                <v-col lg="5">
                    <div class="rounded-lg bg-tableGrey pa-6">
                        <div class="tx-info">
                            <p class="text-button mb-1">To</p>
                            <div class="d-flex align-center">
                                <app-address-blockie :address="transactionData.to || ''" :size="8" class="mr-1 mr-sm-2" />
                                <app-transform-hash
                                    is-blue
                                    :hash="eth.toCheckSum(transactionData.to)"
                                    :link="`/address/${transactionData.to}`"
                                    class="text-body-1"
                                />
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-row>
            <v-row align="center" class="mt-5">
                <v-col class="flex-grow-0 mr-lg-6">
                    <div class="rounded-lg bg-tableGrey pa-6">
                        <div class="tx-info">
                            <p class="text-button mb-1">Value</p>
                            <p class="text-no-wrap">{{ txAmount.value }} ETH</p>
                        </div>
                    </div>
                </v-col>
                <v-col class="flex-grow-0">
                    <div class="rounded-lg bg-tableGrey pa-6">
                        <div class="tx-info">
                            <p class="text-button mb-1">Fee</p>
                            <p class="text-no-wrap">{{ txFee.value }} ETH</p>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-card>
    <v-card variant="elevated" elevation="1" rounded="xl" class="mt-5">
        <v-tabs v-model="state.tab" color="primary" end>
            <v-tab v-for="tab in tabs" @click="changeRoute" :value="tab.routeName" :key="tab.routeName" class="py-3 text-h5 text-capitalize rounded-t-xl">
                {{ tab.text }}
            </v-tab>
        </v-tabs>
        <tab-state v-if="state.tab === routes[0]" :tx-hash="props.txRef" :loading="loadingTransactionHash" />
        <tab-more v-if="state.tab === routes[1]" :tx-data="transactionData" :loading="loadingTransactionHash" />
    </v-card>
</template>

<script setup lang="ts">
import AppDetailsList from '@/core/components/AppDetailsList.vue'
import TxDetailsTitle from '@module/txs/components/TxDetailsTitle.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import TabMore from '@module/txs/components/TabMore.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import BN from 'bignumber.js'
import { Detail } from '@/core/components/props'
import { TxDetailsFragment as TxDetailsType, useGetTransactionByHashWithTracesQuery, useTransactionEventSubscription } from './apollo/TxDetails.generated'
import { ErrorMessageTx, TitleStatus } from '@/modules/txs/models/ErrorMessagesForTx'
import { excpTxDoNotExists } from '@/apollo/errorExceptions'
import { formatNonVariableGWeiValue, formatNumber, FormattedNumber, FormattedNumberUnit, formatVariableUnitEthValue } from '@/core/helper/number-format-helper'
import { eth, timeAgo } from '@core/helper'
import { useGetLatestBlockInfoQuery } from '@module/block/apollo/BlockStats/blockStats.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'
import { Q_TXS_DETAILS, ROUTE_NAME } from '@core/router/routesNames'
import { useRoute, useRouter } from 'vue-router'
import TabState from '@module/txs/components/TabState.vue'

const props = defineProps({
    txRef: {
        type: String,
        required: true
    },
    tab: String
})

const routes = Q_TXS_DETAILS
interface ModuleState {
    hasError: boolean
    subscribed: boolean
    tab: string
}

const state: ModuleState = reactive({
    hasError: false,
    subscribed: false,
    tab: props.tab
})

const emit = defineEmits(['errorDetails'])

const tabs = [
    {
        id: 0,
        text: 'State',
        routeName: routes[0]
    },
    {
        id: 1,
        text: 'More',
        routeName: routes[1]
    }
]

const route = useRoute()
const router = useRouter()

const changeRoute = () => {
    if (route.query.t !== state.tab) {
        router.push({
            query: { t: state.tab }
        })
    }
}

const txAmount = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(transactionData.value?.value || 0))
})

const gasPrice = computed<FormattedNumber>(() => {
    return formatNonVariableGWeiValue(new BN(transactionData.value?.gasPrice || 0))
})

const isReplaced = computed<boolean>(() => {
    return !!transactionData.value && transactionData.value?.replacedBy !== null
})

const enum TxStatus {
    success = 'Successful Tx',
    failed = 'Failed Tx',
    pending = 'Pending Tx',
    replaced = 'Replaced Tx'
}

const txStatus = computed<TxStatus>(() => {
    if (isReplaced.value) {
        return TxStatus.replaced
    }
    const statuses = ['0x0', '0x1']
    if (transactionData.value && transactionData.value?.status === statuses[0]) {
        return TxStatus.failed
    }
    if (transactionData.value && transactionData.value?.status === statuses[1]) {
        return TxStatus.success
    }
    return TxStatus.pending
})

const titleStatus = computed<TitleStatus>(() => {
    if (!isReplaced.value && transactionData.value) {
        switch (transactionData.value?.status) {
            case '0x0':
                return TitleStatus.failed
            case '0x1':
                return TitleStatus.success
            default:
                return TitleStatus.pending
        }
    }
    return TitleStatus.replaced
})

const titleBg = computed<string>(() => {
    switch (titleStatus.value) {
        case TitleStatus.success:
            return 'success'
        case TitleStatus.failed:
            return 'error'
        default:
            return 'blue'
    }
})

const timestamp = computed<string>(() => {
    if (transactionData.value) {
        const date = new Date(transactionData.value?.timestamp * 1e3).toLocaleDateString()
        const time = new Date(transactionData.value?.timestamp * 1e3).toTimeString().split('GMT')[0]
        const timeago = timeAgo(new Date(transactionData.value?.timestamp * 1e3))
        const [month, day, year] = date.split('/')
        return `${year}-${month}-${day}, ${time}, ${timeago}`
    }
    return ''
})

const blockMined = computed<number>(() => {
    if (txStatus.value !== TxStatus.pending && !isReplaced.value) {
        return transactionData.value?.blockNumber || 0
    }
    return 0
})

const { result: blockInfo, loading: loadingBlockInfo } = useGetLatestBlockInfoQuery()
const { newBlockNumber } = useBlockSubscription()

const confirmations = computed<number>(() => {
    if (newBlockNumber.value) {
        return newBlockNumber.value - blockMined.value || 0
    }
    if (blockInfo.value) {
        return blockInfo.value?.getLatestBlockInfo.number - blockMined.value || 0
    }
    return 0
})

const txFee = computed<FormattedNumber>(() => {
    if (transactionData.value && transactionData.value?.gasUsed) {
        const price = new BN(transactionData.value?.gasPrice)
        const used = new BN(transactionData.value?.gasUsed)
        const fee = price.times(used)
        return formatVariableUnitEthValue(fee)
    }
    if (!isReplaced.value && txStatus.value === TxStatus.pending) {
        const fee = new BN(transactionData.value?.gas).multipliedBy(transactionData.value?.gasPrice)
        return formatVariableUnitEthValue(fee)
    }
    return { value: '0', unit: FormattedNumberUnit.ETH }
})

const pendingString = computed<string>(() => {
    return !isReplaced.value && txStatus.value === TxStatus.pending ? 'Estimated Fee' : 'Tx Fee'
})

const txDetails = computed<Detail[]>(() => {
    const isNotContractCreation = typeof transactionData.value?.contractAddress !== 'string'
    const details: Detail[] = [
        {
            title: 'Hash',
            detail: transactionData.value?.hash,
            copy: true,
            mono: true
        },
        {
            title: 'From',
            detail: transactionData.value?.from,
            copy: true,
            link: `/address/${transactionData.value?.from}`,
            mono: true,
            toChecksum: true
        },
        {
            title: isNotContractCreation ? 'To' : 'Contract Creation',
            detail: isNotContractCreation ? transactionData.value?.to : transactionData.value?.contractAddress,
            copy: transactionData.value?.to !== null,
            link: transactionData.value?.to !== null ? `/address/${transactionData.value?.to}` : `/address/${transactionData.value?.contractAddress}`,
            mono: transactionData.value?.to !== null,
            toChecksum: true
        },
        {
            title: 'Amount',
            detail: `${txAmount.value.value} ${txAmount.value.unit?.toUpperCase()}`,
            tooltip: txAmount.value.tooltipText ? `${txAmount.value.tooltipText} ETH` : undefined
        },

        {
            title: pendingString.value,
            detail: `${txFee.value.value} ${txFee.value.unit?.toUpperCase()}`,
            tooltip: txFee.value.tooltipText ? `${txFee.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Status',
            detail: txStatus.value
        },
        {
            title: 'Gas limit',
            detail: formatNumber(new BN(transactionData.value?.gas).toNumber())
        },

        {
            title: 'Gas Price',
            detail: `${gasPrice.value.value} ${gasPrice.value.unit?.toUpperCase()}`,
            tooltip: gasPrice.value.tooltipText ? `${gasPrice.value.tooltipText} ETH` : undefined
        },
        {
            title: 'Gas Used',
            detail: formatNumber(new BN(transactionData.value?.gasUsed || 0).toNumber()) // TODO genesis block txs can have no receipt
        },
        {
            title: 'Nonce',
            detail: transactionData.value?.nonce
        },

        {
            title: 'Input Data',
            detail: transactionData.value?.input
            // txInput: this.inputFormatted
        }
    ]
    if (txStatus.value !== TxStatus.pending && !isReplaced.value) {
        const time = {
            title: 'Timestamp',
            detail: transactionData.value?.timestamp !== null ? new Date(transactionData.value?.timestamp * 1e3).toString() : ''
        }
        details.splice(1, 0, time)
    }

    if (txStatus.value !== TxStatus.pending && !isReplaced.value) {
        const block = {
            title: 'Block #',
            detail: formatNumber(transactionData.value?.blockNumber || 0),
            link: `/block/number/${transactionData.value?.blockNumber}`
        }
        details.splice(0, 0, block)
    }
    if (transactionData.value?.replacedBy !== null) {
        const replaced = {
            title: 'Replaced By',
            detail: transactionData.value?.replacedBy,
            copy: true,
            link: transactionData.value?.replacedBy,
            mono: true
        }
        details.splice(1, 0, replaced)
    }
    return details
})

/**
 * Start apollo subscription
 */
const {
    result: transactionHashResult,
    onResult: onTransactionHashLoaded,
    onError: onTransactionHashError,
    loading: loadingTransactionHash,
    refetch: refetchTransactionHash
} = useGetTransactionByHashWithTracesQuery(() => ({ hash: props.txRef }), { notifyOnNetworkStatusChange: true, fetchPolicy: 'network-only' })

onTransactionHashLoaded(({ data }) => {
    if (data && data.getTransactionByHashWithTraces) {
        if (!isReplaced.value && txStatus.value === TxStatus.pending && !state.subscribed) {
            subscriptionEnabled.value = true
        }
        emitErrorState(false)
    }
})

const transactionData = computed<TxDetailsType | undefined>(() => {
    return transactionHashResult?.value?.getTransactionByHashWithTraces
})

onTransactionHashError(error => {
    const newError = JSON.stringify(error.message)
    if (newError.toLowerCase().includes(excpTxDoNotExists)) {
        emitErrorState(true, true)
    } else {
        emitErrorState(true)
    }
})

const isLoading = computed<boolean | undefined>(() => {
    return loadingTransactionHash.value || state.hasError
})

const subscriptionEnabled = ref(true)

const { onResult: onNewTransactionEvent, onError: onNewTransactionEventError } = useTransactionEventSubscription(
    { hash: props.txRef },
    {
        enabled: subscriptionEnabled.value
    }
)

onNewTransactionEvent(() => {
    refetchTransactionHash()
    subscriptionEnabled.value = false
})

onNewTransactionEventError(() => {
    emitErrorState(true)
})

/**
 * Emit error to Sentry
 * @param val {Boolean}
 * @param hashNotFound {Boolean}
 */
const emitErrorState = (val: boolean, hashNotFound = false): void => {
    state.hasError = val
    const mess = hashNotFound ? ErrorMessageTx.notFound : ErrorMessageTx.details
    emit('errorDetails', state.hasError, mess)
}

onMounted(() => {
    refetchTransactionHash()
})
</script>
