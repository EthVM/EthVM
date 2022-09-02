<template>
    <v-card :variant="!props.isOverview ? 'flat' : 'elevated'" :elevation="props.isOverview ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title class="card-title d-flex justify-space-between align-center mb-5 px-0">
            <div>
                <v-row align="center" class="my-0 mx-0">
                    <div v-if="!props.isOverview && !mdAndDown" class="mr-10">
                        <address-balance-totals
                            title="Token Balance"
                            :is-loading="loadingAddressTokens || loadingMarketInfo"
                            :balance="tokenBalanceValue"
                            :subtext="`${tokenCount} total tokens`"
                        />
                    </div>
                    <span v-if="props.isOverview || mdAndDown" class="text-h6 font-weight-bold">Token History</span>
                    <app-new-update
                        :icon-only="props.isOverview"
                        text="New ERC20 Transfers"
                        :update-count="props.newErc20Transfer"
                        @reload="setPage(0, true)"
                    />
                </v-row>
            </div>
            <app-btn v-if="props.isOverview && !mdAndDown" text="More" isSmall icon="east" @click="goToTokenTransfersPage"></app-btn>
            <app-btn-icon v-if="props.isOverview && mdAndDown" icon="more_horiz" @click="goToTokenTransfersPage"></app-btn-icon>
        </v-card-title>
        <div :class="!props.isOverview ? 'pt-13' : null">
            <!--            Table Header-->

            <v-row v-if="!mdAndDown" class="ma-0">
                <v-col :cols="props.isOverview ? 3 : 2" class="text-body-1 text-info py-0 pl-0"> Token </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="text-body-1 text-info py-0"> Symbol </v-col>
                <v-col :cols="props.isOverview ? 3 : 2" class="text-body-1 text-info py-0"> Amount </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="text-body-1 text-info py-0"> From/To </v-col>
                <v-col :cols="props.isOverview ? 4 : 2" class="text-body-1 text-info py-0"> Address </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="text-body-1 text-info py-0"> Hash </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="text-body-1 text-info py-0"> Timestamp </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="text-body-1 text-info py-0 pr-0 text-right"> More </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <template v-if="initialLoad">
                <div v-for="item in 10" :key="item" class="my-2">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </div>
            </template>
            <template v-else>
                <div v-for="(transfer, index) in transfers" :key="`${transfer.transfer.transactionHash} - ${index}`" class="position-relative">
                    <!--
                           ========================
                             Desktop View
                           =========================
                    -->
                    <template v-if="!mdAndDown">
                        <v-row class="my-5 px-0 text-body-1 font-weight-regular" align="center">
                            <v-col :cols="props.isOverview ? 3 : 2" class="py-0">
                                <v-row class="ma-0 flex-nowrap" align="center">
                                    <img
                                        :src="getImg(transfer.contract) || require('@/assets/icon-token.png')"
                                        alt=""
                                        height="32"
                                        width="32"
                                        class="mr-2 rounded-circle"
                                    />
                                    <div style="display: grid">
                                        <router-link
                                            v-if="transfer.tokenInfo.name !== '' || transfer.tokenInfo.symbol"
                                            :to="`/token/${transfer.contract}`"
                                            class="text-textPrimary text-ellipses"
                                        >
                                            <p v-if="transfer.tokenInfo.name" class="text-ellipses">{{ transfer.tokenInfo.name }}</p>
                                            <p v-else class="text-uppercase caption text-ellipses">{{ transfer.tokenInfo.symbol }}</p>
                                        </router-link>
                                        <p v-if="props.isOverview" class="text-info pt-1">
                                            {{ transfer.tokenInfo.symbol }}
                                        </p>
                                    </div>
                                </v-row>
                            </v-col>
                            <v-col v-if="!props.isOverview" cols="1" class="text-info py-0 text-ellipses">
                                {{ transfer.tokenInfo.symbol }}
                            </v-col>
                            <v-col :cols="props.isOverview ? 3 : 2" class="py-0">
                                <v-row class="ma-0" align="center">
                                    <p>
                                        {{ getAmount(transfer).value }}
                                    </p>
                                </v-row>
                                <p v-if="props.isOverview" class="text-info">
                                    {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}
                                </p>
                            </v-col>
                            <v-col :cols="props.isOverview ? 2 : 1" class="py-0">
                                <app-chip
                                    :bg="transferType(transfer) === 'in' ? 'success' : 'orange'"
                                    :text="transferType(transfer) === 'in' ? 'From' : 'To'"
                                />
                            </v-col>
                            <v-col :cols="props.isOverview ? 4 : 2" class="text-secondary py-0">
                                <div class="d-flex align-center">
                                    <app-address-blockie :address="eth.toCheckSum(transferTypeAddress(transfer)) || ''" :size="6" class="mr-5" />
                                    <app-transform-hash
                                        is-blue
                                        is-short
                                        :hash="eth.toCheckSum(transferTypeAddress(transfer))"
                                        :link="`/address/${eth.toCheckSum(transferTypeAddress(transfer))}`"
                                    />
                                </div>
                            </v-col>
                            <v-col v-if="!props.isOverview" cols="2" class="text-secondary py-0">
                                <app-transform-hash
                                    is-blue
                                    is-short
                                    :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                    :link="`/tx/${eth.toCheckSum(transfer.transfer.transactionHash)}`"
                                />
                            </v-col>
                            <v-col v-if="!props.isOverview" cols="1" class="text-info py-0">
                                {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}
                            </v-col>
                            <v-col v-if="!props.isOverview" cols="1" class="py-0 text-right">
                                <app-btn-icon
                                    :icon="getDropdownIcon(transfer.transfer.transactionHash)"
                                    @click="toggleMoreDetails(transfer.transfer.transactionHash)"
                                ></app-btn-icon>
                            </v-col>
                        </v-row>
                        <v-row v-if="visibleDetails.has(transfer.transfer.transactionHash)">
                            <v-col md="3" class="text-right text-body-1 font-weight-bold text-info">Balance Before</v-col>
                            <v-col md="9" class="text-subtitle-2">{{ getTransferBalanceBefore(transfer).value }} {{ transfer.tokenInfo.symbol }}</v-col>
                            <v-col md="3" class="text-right text-body-1 font-weight-bold text-info">Balance After</v-col>
                            <v-col md="9" class="text-subtitle-2">{{ getTransferBalanceAfter(transfer).value }} {{ transfer.tokenInfo.symbol }}</v-col>
                        </v-row>
                    </template>
                    <!--
                           ========================
                             Mobile/Tablet View
                           =========================
                    -->
                    <template v-else>
                        <v-row class="my-5 text-subtitle-2 font-weight-regular" @click="toggleMoreDetails(transfer.transfer.transactionHash)">
                            <v-col cols="6" class="pb-2">
                                <div class="d-flex align-center flex-nowrap">
                                    <div class="mobile-chip rounded-circle mr-2" :class="transferType(transfer) ? 'bg-success' : 'bg-orange'">
                                        <v-icon size="18">
                                            {{ transferType(transfer) === 'in' ? 'south_east' : 'north_west' }}
                                        </v-icon>
                                    </div>
                                    <span>
                                        {{ transferType(transfer) === 'in' ? 'Received' : 'Sent' }}
                                    </span>
                                </div>
                            </v-col>
                            <v-col cols="6" class="pb-2">
                                <div class="d-flex align-center">
                                    <img
                                        :src="getImg(transfer.contract) || require('@/assets/icon-token.png')"
                                        alt=""
                                        height="24"
                                        width="24"
                                        class="mr-2 rounded-circle"
                                    />
                                    <span> {{ getAmount(transfer).value }} {{ transfer.tokenInfo.symbol }} </span>
                                </div>
                            </v-col>
                            <v-col cols="6" class="py-0 text-info">
                                {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }} {{ transferType(transfer) === 'in' ? 'from' : 'to' }}
                            </v-col>
                            <v-col cols="6" class="py-0 text-secondary">
                                <div class="d-flex align-center">
                                    <app-address-blockie :address="eth.toCheckSum(transferTypeAddress(transfer)) || ''" :size="6" class="mr-2" />
                                    <app-transform-hash
                                        is-blue
                                        is-short
                                        :hash="eth.toCheckSum(transferTypeAddress(transfer))"
                                        :link="`/address/${eth.toCheckSum(transferTypeAddress(transfer))}`"
                                    />
                                </div>
                            </v-col>
                        </v-row>
                        <div v-if="visibleDetails.has(transfer.transfer.transactionHash)" class="pb-5 text-subtitle-2 font-weight-regular">
                            <div>
                                <p class="text-info mb-1">Hash</p>
                                <app-transform-hash
                                    is-blue
                                    is-short
                                    :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                    :link="`/tx/${eth.toCheckSum(transfer.transfer.transactionHash)}`"
                                />
                            </div>
                            <v-divider class="my-5 mx-n4 mx-sm-n6" />
                            <v-row justify="space-between" class="my-5 mx-0">
                                <p class="text-info">Balance Before</p>
                                <p>{{ getTransferBalanceBefore(transfer).value }} {{ transfer.tokenInfo.symbol }}</p>
                            </v-row>
                            <v-row justify="space-between" class="my-5 mx-0">
                                <p class="text-info">Tx Fee Paid</p>
                                <p class="text-error">-{{ getTxFee(transfer).value }} {{ getTxFee(transfer).unit.toUpperCase() }}</p>
                            </v-row>
                            <v-row justify="space-between" class="my-5 mx-0">
                                <p class="text-info">Balance After</p>
                                <p>{{ getTransferBalanceAfter(transfer).value }} {{ transfer.tokenInfo.symbol }}</p>
                            </v-row>
                        </div>
                    </template>
                    <div v-if="visibleDetails.has(transfer.transfer.transactionHash)" class="row-bg bg-tableGrey"></div>
                </div>
                <app-intersect v-if="!props.isOverview && hasMore" @intersect="loadMoreData">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                    <v-divider />
                </app-intersect>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppChip from '@core/components/AppChip.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { formatFloatingPointValue, formatNonVariableEthValue, FormattedNumber } from '@core/helper/number-format-helper'
const { getEthereumTokensMap } = useCoinData()
import { useDisplay } from 'vuetify'
import { TransferFragmentFragment as Transfer, useGetAddressErc20TransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'
import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'

const MAX_ITEMS = 10
const MOBILE_MAX_ITEMS = 4
const TYPES = ['in', 'out', 'self']

const { smAndDown, mdAndDown } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    newErc20Transfer: Number,
    isOverview: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits<{
    (e: 'resetCount', eventType: AddressEventType, isReset: boolean): void
}>()

interface ComponentState {
    showMoreTokenDetails: boolean
    activeToken: false | TokenMarketData
    sortKey: string
    sortDirection: string
    index: number
}

const state: ComponentState = reactive({
    showMoreTokenDetails: false,
    activeToken: false,
    sortKey: TOKEN_FILTER_VALUES[1],
    sortDirection: 'high',
    index: 0
})

const { tokenBalanceValue, tokenCount, initialLoad: loadingAddressTokens } = useAddressToken(props.addressHash)
const { loading: loadingMarketInfo } = useCoinData()

const {
    result,
    loading: loadingTransfers,
    fetchMore,
    refetch
} = useGetAddressErc20TransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getERC20Transfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getERC20Transfers.transfers || [])

const transfers = computed<Array<Transfer | null>>(() => {
    if (transferHistory.value.length > 0) {
        const start = MAX_ITEMS * state.index
        const end = start + MAX_ITEMS > transferHistory.value?.length ? transferHistory.value?.length : start + MAX_ITEMS
        // If on mobile screen and on overview page
        if (mdAndDown.value && props.isOverview) {
            return transferHistory.value.slice(start, MOBILE_MAX_ITEMS)
        }
        if (props.isOverview) {
            return transferHistory.value.slice(start, end)
        }
        return transferHistory.value
    }
    return []
})

/*
 * Initial load will be true only when the data is being loaded initially
 */
const initialLoad = computed<boolean>(() => {
    return !result.value
})

const tokenImg = computed<Map<string, TokenMarketData> | false>(() => {
    if (!loadingTransfers.value) {
        const contracts: string[] = []
        transferHistory.value.forEach(token => {
            if (token) {
                contracts.push(token.contract)
            }
        })
        if (contracts.length > 0) {
            return getEthereumTokensMap(contracts)
        }
    }
    return false
})

/**
 * Fetches image for the contract
 * @param contract {String}
 * @returns {TokenMarketData} or {undefined}
 */
const getImg = (contract: string): string | undefined => {
    if (!loadingTransfers.value && tokenImg.value && tokenImg.value.has(contract)) {
        const token = tokenImg.value.get(contract)
        return token?.image
    }
    return undefined
}

const transferType = (transfer: Transfer): string => {
    const from = transfer.transfer.from.toLowerCase()
    const to = transfer.transfer.to.toLowerCase()
    const addr = props.addressHash.toLowerCase()

    if (addr === from && addr === to) {
        return TYPES[2]
    } else if (addr === from) {
        return TYPES[1]
    }
    return TYPES[0]
}

const transferTypeAddress = (transfer: Transfer): string => {
    switch (transferType(transfer)) {
        case TYPES[0]:
            return transfer.transfer.from
        case TYPES[1]:
            return transfer.transfer.to
        default:
            return props.addressHash
    }
}

const getValue = (transfer: Transfer): BN => {
    let n = new BN(transfer.value)
    if (transfer.tokenInfo.decimals) {
        n = n.div(new BN(10).pow(transfer.tokenInfo.decimals))
    }
    return n
}

const getTransferBalanceBefore = (transfer: Transfer): FormattedNumber => {
    const type = transferTypeAddress(transfer)
    if (!transfer.stateDiff) {
        return { value: '0' }
    }
    if (type === TYPES[0] && transfer.stateDiff.to) {
        return formatNonVariableEthValue(new BN(transfer.stateDiff.to.before))
    }
    return formatNonVariableEthValue(new BN(transfer.stateDiff.to.before))
}

const getTransferBalanceAfter = (transfer: Transfer): FormattedNumber => {
    const type = transferTypeAddress(transfer)
    if (!transfer.stateDiff) {
        return { value: '0' }
    }
    if (type === TYPES[0] && transfer.stateDiff.to) {
        return formatNonVariableEthValue(new BN(transfer.stateDiff.to.after))
    }
    return formatNonVariableEthValue(new BN(transfer.stateDiff.to.after))
}

const getTxFee = (transfer: Transfer) => {
    return formatNonVariableEthValue(new BN(transfer.transfer.txFee))
}

const getAmount = (transfer: Transfer) => {
    return formatFloatingPointValue(getValue(transfer))
}

const visibleDetails = ref(new Set())
const toggleMoreDetails = (transfer: string): void => {
    if (visibleDetails.value.has(transfer)) {
        visibleDetails.value.delete(transfer)
    } else {
        visibleDetails.value.add(transfer)
    }
}

const getDropdownIcon = (transfer: string): string => {
    return visibleDetails.value.has(transfer) ? 'expand_less' : 'expand_more'
}

const setPage = (page: number, reset = false) => {
    if (reset) {
        refetch()
        emit('resetCount', AddressEventType.NewErc20Transfer, true)
    } else {
        if (page > state.index && hasMore.value) {
            fetchMore({
                variables: {
                    hash: props.addressHash,
                    _limit: MAX_ITEMS,
                    _nextKey: result.value?.getERC20Transfers?.nextKey
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    return {
                        getERC20Transfers: {
                            nextKey: fetchMoreResult?.getERC20Transfers.nextKey,
                            transfers: [...prev.getERC20Transfers.transfers, ...(fetchMoreResult?.getERC20Transfers.transfers || [])],
                            __typename: fetchMoreResult?.getERC20Transfers.__typename
                        }
                    }
                }
            })
        }
    }
    state.index = page
}

const loadMoreData = (e: boolean): void => {
    if (transfers.value.length && e && !props.isOverview) {
        setPage(state.index + 1)
    }
}

const router = useRouter()
const goToTokenTransfersPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_TOKENS.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_TOKENS[1] }
    })
}
</script>

<style lang="scss" scoped>
.card-title {
    min-height: 50px;
}

.row-bg {
    top: -20px;
    bottom: 0;
    left: -24px;
    right: -24px;
    position: absolute;
    z-index: -1;
}
</style>
