<template>
    <v-card :variant="!props.isOverview ? 'flat' : 'elevated'" :elevation="props.isOverview ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6">
        <v-card-title class="justify-space-between px-0">
            <v-row>
                <v-col md="3">
                    <address-balance-totals
                        title="Token Balance"
                        :is-loading="initialLoad || loadingMarketInfo"
                        :balance="tokenBalanceValue"
                        :subtext="`${tokenCount} total tokens`"
                    />
                    <app-new-update text="New ERC20 Transfers" :update-count="props.newErc20Transfer" @reload="setPage(0, true)" />
                </v-col>
            </v-row>
            <app-paginate-has-more
                :class="smAndDown ? 'pt-3' : ''"
                :has-more="hasMore"
                :current-page="state.index"
                :loading="loadingTransfers"
                @newPage="setPage"
            />
        </v-card-title>
        <div>
            <!--            Table Header-->
            <v-row class="ma-0">
                <v-col cols="2" class="text-body-1 text-info py-0 pl-0"> Token </v-col>
                <v-col cols="1" class="text-body-1 text-info py-0"> Symbol </v-col>
                <v-col cols="2" class="text-body-1 text-info py-0"> Amount </v-col>
                <v-col cols="1" class="text-body-1 text-info py-0"> From/To </v-col>
                <v-col cols="2" class="text-body-1 text-info py-0"> Address </v-col>
                <v-col cols="2" class="text-body-1 text-info py-0"> Hash </v-col>
                <v-col cols="1" class="text-body-1 text-info py-0"> Timestamp </v-col>
                <v-col cols="1" class="text-body-1 text-info py-0 pr-0"> More </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <template v-if="loadingTransfers">
                <div v-for="item in 10" :key="item" class="my-2">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </div>
            </template>
            <template v-else>
                <v-row
                    v-for="(transfer, index) in transfers"
                    :key="`${transfer.transfer.transactionHash} - ${index}`"
                    class="my-5 mx-0 px-0 text-subtitle-2 font-weight-regular"
                    align="center"
                >
                    <v-col cols="2" class="py-0 pl-0">
                        <v-row class="ma-0" align="center">
                            <div class="token-image">
                                <img :src="getImg(transfer.contract) || require('@/assets/icon-token.png')" alt="" height="24" width="24" class="mr-2" />
                            </div>
                            <router-link
                                v-if="transfer.tokenInfo.name !== '' || transfer.tokenInfo.symbol"
                                :to="`/token/${transfer.contract}`"
                                class="text-textPrimary"
                            >
                                <p v-if="transfer.tokenInfo.name">{{ transfer.tokenInfo.name }}</p>
                                <p v-else class="text-uppercase caption">{{ transfer.tokenInfo.symbol }}</p>
                            </router-link>
                        </v-row>
                    </v-col>
                    <v-col cols="1" class="text-info py-0">
                        {{ transfer.tokenInfo.symbol }}
                    </v-col>
                    <v-col cols="2" class="py-0">
                        <v-row class="ma-0" align="center">
                            <p>
                                {{ getAmount(transfer).value }}
                                <app-tooltip v-if="getAmount(transfer).tooltipText" :text="`${getAmount(transfer).tooltipText} ${transfer.tokenInfo.symbol}`" />
                            </p>
                        </v-row>
                    </v-col>
                    <v-col cols="1" class="py-0">
                        <app-chip :bg="transferType(transfer) === 'in' ? 'success' : 'orange'" :text="transferType(transfer) === 'in' ? 'From' : 'To'" />
                    </v-col>
                    <v-col cols="2" class="text-link py-0">
                        <app-transform-hash class="text-secondary" :hash="eth.toCheckSum(transferTypeAddress(transfer))" />
                    </v-col>
                    <v-col cols="2" class="text-secondary py-0">
                        <app-transform-hash :hash="eth.toCheckSum(transfer.transfer.transactionHash)" />
                    </v-col>
                    <v-col cols="1" class="text-info py-0">
                        {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}
                    </v-col>
                    <v-col cols="1" class="py-0 pr-0">
                        <app-btn-icon icon="expand_more"></app-btn-icon>
                    </v-col>
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import AppTooltip from '@core/components/AppTooltip.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppChip from '@core/components/AppChip.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { formatFloatingPointValue } from '@core/helper/number-format-helper'
const { getEthereumTokensMap } = useCoinData()
import { useDisplay } from 'vuetify'
import { TransferFragmentFragment as Transfer, useGetAddressErc20TransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'
import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'

const MAX_ITEMS = 10
const TYPES = ['in', 'out', 'self']

const { smAndDown } = useDisplay()
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

const { tokenBalanceValue, tokenCount, initialLoad } = useAddressToken(props.addressHash)
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
        return transferHistory.value.slice(start, end)
    }
    return []
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

const getAmount = (transfer: Transfer) => {
    return formatFloatingPointValue(getValue(transfer))
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
</script>
