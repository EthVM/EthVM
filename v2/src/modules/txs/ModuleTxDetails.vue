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
        <template v-if="loadingTransactionHash">Loading Hash</template>
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
                        <p class="text-body-2 text-info mt-1">({{ timestamp }})</p>
                    </div>
                </v-col>
                <v-col lg="2">
                    <div class="tx-info">
                        <p class="text-button mb-1">Block Mined</p>
                        <p class="text-body-1 text-secondary mt-1">{{ blockMined }}</p>
                    </div>
                </v-col>
            </v-row>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import AppDetailsList from '@/core/components/AppDetailsList.vue'
import TxDetailsTitle from '@module/txs/components/TxDetailsTitle.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import BN from 'bignumber.js'
import { Detail } from '@/core/components/props'
import { TxDetailsFragment as TxDetailsType, useGetTransactionByHashWithTracesQuery, useTransactionEventSubscription } from './apollo/TxDetails.generated'
import { ErrorMessageTx, TitleStatus } from '@/modules/txs/models/ErrorMessagesForTx'
import { excpTxDoNotExists } from '@/apollo/errorExceptions'
import { formatNonVariableGWeiValue, formatNumber, FormattedNumber, FormattedNumberUnit, formatVariableUnitEthValue } from '@/core/helper/number-format-helper'
import { timeAgo } from '@core/helper'
const props = defineProps({
    txRef: String
})

const emit = defineEmits(['errorDetails'])

const txAmount = computed<FormattedNumber>(() => {
    return formatVariableUnitEthValue(new BN(transactionData.value?.value))
})

const gasPrice = computed<FormattedNumber>(() => {
    return formatNonVariableGWeiValue(new BN(transactionData.value?.gasPrice))
})

const isReplaced = computed<boolean>(() => {
    return transactionData.value && transactionData.value?.replacedBy !== null
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

const blockMined = computed<string | null>(() => {
    if (txStatus.value !== TxStatus.pending && !isReplaced.value) {
        return formatNumber(transactionData.value?.blockNumber || 0)
    }
    return null
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

interface ModuleState {
    hasError: boolean
    subscribed: boolean
}

const state: ModuleState = reactive({
    hasError: false,
    subscribed: false
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
    if (data && data.getTransactionByHash) {
        if (!isReplaced.value && txStatus.value === TxStatus.pending && !state.subscribed) {
            subscriptionEnabled.value = true
        }
        emitErrorState(false)
    }
})

const transactionData = computed<TxDetailsType>(() => {
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
