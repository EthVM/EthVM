<template>
    <v-row v-if="!state.hasError" :class="rowMargin">
        <v-col cols="12" :class="columnPadding">
            <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6">
                <v-row no-gutters>
                    <v-col cols="12" md="auto" lg="4" order="last" order-md="first">
                        <div class="d-flex align-center justify-start">
                            <h2 class="text-h6 font-weight-bold mr-2 mr-sm-6">{{ $t('txs.details.header') }}</h2>
                            <template v-if="loadingTransactionHash">
                                <div class="skeleton-box rounded-xl" style="height: 24px; width: 100px"></div>
                            </template>
                            <div v-else>
                                <app-chip :bg="titleBg" rounded="xl" text="" class="">
                                    <p>
                                        {{ titleStatusString }}
                                        <span>
                                            <v-progress-circular
                                                v-if="txStatus === TxStatus.pending"
                                                indeterminate
                                                color="white"
                                                size="15"
                                                width="2"
                                                class="ml-2"
                                            />
                                        </span>
                                    </p>
                                </app-chip>
                            </div>
                        </div>
                    </v-col>
                    <v-spacer />
                    <v-col cols="12" md="auto" lg="8" order="first" order-md="last" class="mb-6 mb-md-0 pa-0">
                        <app-ad-buttons-small />
                    </v-col>
                </v-row>
                <v-row class="mt-md-5">
                    <v-col cols="12" lg="6">
                        <div class="tx-info">
                            <p class="text-button mb-1">{{ $t('txs.details.txHash') }}</p>
                            <div class="d-flex align-center justify-start">
                                <app-transform-hash :hash="props.txRef" class="text-body-1" />
                                <app-copy-to-clip :value-to-copy="eth.toCheckSum(props.txRef)" class="mx-3" />
                            </div>
                            <template v-if="loadingTransactionHash">
                                <div class="skeleton-box rounded-xl mt-1" style="height: 18px; max-width: 300px"></div>
                            </template>
                            <template v-else>
                                <p v-if="txStatus !== TxStatus.pending && !isReplaced" class="text-body-2 text-info mt-1">({{ timestamp }})</p>
                            </template>
                        </div>
                    </v-col>
                    <template v-if="txStatus !== TxStatus.pending && !isReplaced">
                        <v-col cols="12" lg="2">
                            <div class="tx-info">
                                <p class="text-button mb-1">{{ $t('common.blockMined') }}</p>
                                <template v-if="loadingTransactionHash">
                                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                                </template>
                                <router-link :to="`/block/number/${blockMined}`" class="text-secondary">
                                    {{ formatNumber(blockMined) }}
                                </router-link>
                            </div>
                        </v-col>
                        <v-col cols="12" lg="2">
                            <div class="tx-info">
                                <p class="text-button mb-1">{{ $t('common.confirmations') }}</p>
                                <p v-if="!loadingBlockInfo" class="text-body-1 text-secondary mt-1">
                                    {{ confirmations }}
                                </p>
                                <div v-else class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                            </div>
                        </v-col>
                    </template>
                </v-row>
                <v-row align="center" class="mt-5">
                    <v-col cols="12" lg="5">
                        <div class="rounded-lg bg-lightGrey pa-6">
                            <div class="tx-info">
                                <p class="text-button mb-1">{{ $t('common.from') }}</p>
                                <template v-if="loadingTransactionHash || !transactionData">
                                    <div class="d-flex align-center">
                                        <div class="skeleton-box rounded-circle mr-1 mr-sm-2 flex-shrink-0" style="height: 32px; width: 32px"></div>
                                        <div class="skeleton-box rounded-xl" style="height: 20px"></div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="d-flex align-center">
                                        <app-address-blockie :address="transactionData.from || ''" :size="8" class="mr-1 mr-sm-2" />
                                        <app-transform-hash
                                            is-blue
                                            :hash="eth.toCheckSum(transactionData.from)"
                                            :link="`/address/${transactionData.from}`"
                                            class="text-body-1"
                                        />
                                        <app-copy-to-clip :value-to-copy="eth.toCheckSum(transactionData.from)" class="mx-3" />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </v-col>
                    <v-icon class="mx-3" :class="{ 'mx-auto': mdAndDown }">{{ mdAndDown ? 'expand_more' : 'chevron_right' }}</v-icon>
                    <v-col cols="12" lg="5">
                        <div class="rounded-lg bg-lightGrey pa-6">
                            <div class="tx-info">
                                <p v-if="transactionData && transactionData.contractAddress" class="text-button mb-1">
                                    {{ $t('txs.details.createdContract') }}
                                </p>
                                <p v-else-if="transactionData && transactionData.isContractCall" class="text-button mb-1">
                                    {{ $t('txs.details.interactedWith') }}
                                </p>
                                <p v-else class="text-button mb-1">{{ $t('common.to') }}</p>
                                <template v-if="loadingTransactionHash || !transactionData">
                                    <div class="d-flex align-center">
                                        <div class="skeleton-box rounded-circle mr-1 mr-sm-2 flex-shrink-0" style="height: 32px; width: 32px"></div>
                                        <div class="skeleton-box rounded-xl" style="height: 20px"></div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="d-flex align-center">
                                        <app-address-blockie
                                            :address="transactionData.to || transactionData.contractAddress || ''"
                                            :size="8"
                                            class="mr-1 mr-sm-2"
                                        />
                                        <app-transform-hash
                                            is-blue
                                            :hash="eth.toCheckSum(transactionData.to || transactionData.contractAddress || '')"
                                            :link="`/address/${transactionData.to || transactionData.contractAddress || ''}`"
                                            class="text-body-1"
                                        />
                                        <app-copy-to-clip
                                            v-if="transactionData.to || transactionData.contractAddress"
                                            :value-to-copy="eth.toCheckSum(transactionData.to || transactionData.contractAddress)"
                                            class="mx-3"
                                        />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </v-col>
                </v-row>
                <v-row align="center" class="mt-5">
                    <v-col cols="12" sm="6" md="4" lg="2" class="flex-grow-0 mr-lg-6">
                        <div class="rounded-lg bg-lightGrey pa-6">
                            <div class="tx-info">
                                <p class="text-button mb-1">{{ $t('common.value') }}</p>
                                <div v-if="loadingTransactionHash" class="skeleton-box rounded-xl" style="height: 21px"></div>
                                <p v-else class="text-no-wrap">{{ txAmount.value }} {{ currencyName }}</p>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" lg="2" class="flex-grow-0">
                        <div class="rounded-lg bg-lightGrey pa-6">
                            <div class="tx-info">
                                <p class="text-button mb-1">{{ $t('common.fee') }}</p>
                                <div v-if="loadingTransactionHash" class="skeleton-box rounded-xl" style="height: 21px"></div>
                                <p v-else class="text-no-wrap">{{ txFee.value }} {{ currencyName }}</p>
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <app-ad-buttons-large />
        </v-col>
        <v-col cols="12" :class="columnPadding">
            <v-card variant="elevated" elevation="1" rounded="xl" class="py-4 py-sm-6">
                <app-tabs v-model="state.tab" :routes="routes" :tabs="tabs" @update:modelValue="changeRoute" class="mx-n1 mt-n2 mb-4"></app-tabs>
                <tab-state v-if="state.tab === routes[0]" :tx-hash="props.txRef" :tx-status="txStatus" :loading="loadingTransactionHash" />
                <tab-more v-if="state.tab === routes[1]" :tx-data="transactionData" :loading="loadingTransactionHash" />
                <module-tx-actions v-if="state.tab === routes[2]" :tx-hash="props.txRef"></module-tx-actions>
                <keep-alive>
                    <module-tx-logs v-if="state.tab === routes[3]" :tx-ref="props.txRef" :logs="txLogs" :loading="loadingTransactionHash"></module-tx-logs>
                </keep-alive>
            </v-card>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import AppAdButtonsLarge from '@/core/components/AppAdButtonsLarge.vue'
import AppChip from '@core/components/AppChip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppAdButtonsSmall from '@/core/components/AppAdButtonsSmall.vue'
import TabMore from '@module/txs/components/TabMore.vue'
import AppTabs from '@/core/components/AppTabs.vue'
import ModuleTxActions from './ModuleTxActions.vue'
import ModuleTxLogs from './ModuleTxLogs.vue'
import AppCopyToClip from '@/core/components/AppCopyToClip.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import BN from 'bignumber.js'
import {
    TxDetailsFragment as TxDetailsType,
    useGetTransactionByHashQuery,
    useTransactionEventSubscription,
    LogFragmentFragment as Log
} from './apollo/TxDetails/TxDetails.generated'
import { ErrorMessageTx, TitleStatus } from '@/modules/txs/models/ErrorMessagesForTx'
import { excpTxDoNotExists } from '@/apollo/errorExceptions'
import { formatNumber, FormattedNumber, formatVariableUnitEthValue } from '@/core/helper/number-format-helper'
import { eth, timeAgo } from '@core/helper'
import { useGetLatestBlockInfoQuery } from '@module/block/apollo/BlockStats/blockStats.generated'
import { useBlockSubscription } from '@core/composables/NewBlock/newBlock.composable'
import { Q_TXS_DETAILS } from '@core/router/routesNames'
import { useRoute, useRouter } from 'vue-router'
import TabState from '@module/txs/components/TabState.vue'
import { useDisplay } from 'vuetify'
import { TxStatus } from '@module/txs/models/ErrorMessagesForTx'
import { Tab } from '@core/components/props'
import { useNetwork } from '@core/composables/Network/useNetwork'
import { useAppViewGrid } from '@core/composables/AppViewGrid/AppViewGrid.composable'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { columnPadding, rowMargin } = useAppViewGrid()
const { currencyName } = useNetwork()
const props = defineProps({
    txRef: {
        type: String,
        required: true
    },
    tab: String
})

const routes = Q_TXS_DETAILS

const tabs: Tab[] = [
    {
        value: routes[2],
        title: t('txs.details.actions.header')
    },
    {
        value: routes[3],
        title: t('txs.details.logs.header')
    },
    {
        value: routes[0],
        title: t('txs.details.state.header')
    },
    {
        value: routes[1],
        title: t('txs.details.other.header')
    }
]

const { mdAndDown } = useDisplay()
interface ModuleState {
    hasError: boolean
    subscribed: boolean
    tab: string
}

const state: ModuleState = reactive({
    hasError: false,
    subscribed: false,
    tab: props.tab || ''
})

const emit = defineEmits(['errorDetails'])

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

const isReplaced = computed<boolean>(() => {
    return !!transactionData.value && transactionData.value?.replacedBy !== null
})

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
const titleStatusString = computed<string>(() => {
    switch (titleStatus.value) {
        case TitleStatus.success:
            return t('txs.details.status.successful')
        case TitleStatus.failed:
            return t('txs.details.status.failed')
        case TitleStatus.pending:
            return t('txs.details.status.pending')
        default:
            return t('txs.details.status.replaced')
    }
})

const titleBg = computed<string>(() => {
    switch (titleStatus.value) {
        case TitleStatus.success:
            return 'success'
        case TitleStatus.failed:
            return 'error'
        case TitleStatus.pending:
            return 'purple'
        default:
            return 'info'
    }
})

const timestamp = computed<string>(() => {
    if (transactionData.value && transactionData.value?.timestamp) {
        const date = new Date(transactionData.value.timestamp * 1e3).toLocaleDateString()
        const time = new Date(transactionData.value.timestamp * 1e3).toTimeString().split('GMT')[0]
        const timeago = timeAgo(new Date(transactionData.value.timestamp * 1e3), false)
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
    if (!isReplaced.value && txStatus.value === TxStatus.pending && transactionData.value?.gas) {
        const fee = new BN(transactionData.value.gas).multipliedBy(transactionData.value.gasPrice)
        return formatVariableUnitEthValue(fee)
    }
    return { value: '0', unit: currencyName.value }
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
} = useGetTransactionByHashQuery(() => ({ hash: props.txRef }), {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only'
})

onTransactionHashLoaded(({ data }) => {
    if (data && data.getTransactionByHash) {
        if (!isReplaced.value && txStatus.value === TxStatus.pending && !state.subscribed) {
            subscriptionEnabled.value = true
        }
        emitErrorState(false)
    }
})

const transactionData = computed<TxDetailsType | undefined>(() => {
    return transactionHashResult?.value?.getTransactionByHash
})

onTransactionHashError(error => {
    const newError = JSON.stringify(error.message)

    state.hasError = true
    if (newError.toLowerCase().includes(excpTxDoNotExists)) {
        emitErrorState(true, true)
    } else {
        emitErrorState(true)
    }
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
const txLogs = computed<Log[]>(() => {
    if (!loadingTransactionHash.value && transactionData.value) {
        return transactionData.value.logs
    }
    return []
})
</script>
