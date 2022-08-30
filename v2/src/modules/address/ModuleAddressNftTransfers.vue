<template>
    <v-card
        :variant="!props.isOverview ? 'flat' : 'elevated'"
        :elevation="props.isOverview ? 1 : 0"
        rounded="xl"
        class="pa-4 pa-sm-6"
        :class="props.isOverview ? 'h-100' : null"
    >
        <v-card-title class="card-title d-flex justify-space-between align-center mb-5 px-0">
            <div>
                <v-row align="center" class="my-0 mx-0">
                    <div v-if="!props.isOverview && !mdAndDown" class="mr-10">
                        <address-balance-totals
                            title="NFT Balance"
                            :is-loading="loadingAddressTokens || loadingMarketInfo"
                            :balance="tokenBalanceValue"
                            :subtext="`${tokenCount} total NFT's`"
                        />
                    </div>
                    <span v-if="props.isOverview || mdAndDown" class="text-h6 font-weight-bold">NFT History</span>
                    <app-new-update
                        :icon-only="props.isOverview"
                        text="New ERC20 Transfers"
                        :update-count="props.newErc721Transfer"
                        @reload="setPage(0, true)"
                    />
                </v-row>
            </div>
            <app-btn v-if="props.isOverview && !mdAndDown" text="More" isSmall icon="east" @click="goToNftTransfersPage"></app-btn>
            <app-btn-icon v-if="props.isOverview && mdAndDown" icon="more_horiz" @click="goToNftTransfersPage"></app-btn-icon>
        </v-card-title>
        <div :class="!props.isOverview && !mdAndDown ? 'pt-13' : null">
            <!--            Table Header-->

            <v-row v-if="!mdAndDown" class="my-0 text-body-1 text-info">
                <v-col :cols="props.isOverview ? 4 : 3" class="py-0"> Name/Id </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0"> Copies </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0"> From/To </v-col>
                <v-col :cols="props.isOverview ? 4 : 3" class="py-0"> Address </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="py-0"> Hash </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="py-0"> Timestamp </v-col>
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
                    <v-row v-if="!mdAndDown" class="my-5 px-0 text-subtitle-2 font-weight-regular" align="center">
                        <v-col :cols="props.isOverview ? 4 : 3" class="py-0">
                            <v-row class="ma-0 flex-nowrap" align="center">
                                <img :src="getImg(transfer)" alt="" height="41" width="41" class="mr-2 rounded-circle" />
                                <div style="display: grid">
                                    <router-link
                                        v-if="transfer.tokenInfo.name !== '' || transfer.tokenInfo.symbol"
                                        :to="`/token/${transfer.contract}`"
                                        class="text-textPrimary text-ellipses"
                                    >
                                        <p v-if="transfer.tokenInfo.name" class="text-ellipses">{{ transfer.tokenInfo.name }}</p>
                                        <p v-else class="text-uppercase caption text-ellipses">N/A</p>
                                    </router-link>
                                </div>
                            </v-row>
                        </v-col>
                        <v-col :cols="props.isOverview ? 2 : 1" class="text-info py-0 text-ellipses">
                            {{ getTotalTokens(transfer) }}
                        </v-col>
                        <v-col :cols="props.isOverview ? 2 : 1" class="py-0">
                            <app-chip :bg="transferType(transfer) === 'in' ? 'success' : 'warning'" :text="transferType(transfer) === 'in' ? 'From' : 'To'" />
                        </v-col>
                        <v-col :cols="props.isOverview ? 4 : 3" class="text-secondary py-0">
                            <div class="d-flex align-center">
                                <app-address-blockie :address="eth.toCheckSum(transferTypeAddress(transfer)) || ''" :size="6" class="mr-5" />
                                <app-transform-hash
                                    is-blue
                                    start="5"
                                    end="5"
                                    :hash="eth.toCheckSum(transferTypeAddress(transfer))"
                                    :link="`/address/${eth.toCheckSum(transferTypeAddress(transfer))}`"
                                />
                            </div>
                        </v-col>
                        <v-col v-if="!props.isOverview" cols="2" class="text-secondary py-0">
                            <app-transform-hash
                                is-blue
                                start="5"
                                end="5"
                                :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                :link="`/tx/${eth.toCheckSum(transfer.transfer.transactionHash)}`"
                            />
                        </v-col>
                        <v-col v-if="!props.isOverview" cols="2" class="text-info py-0">
                            {{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}
                        </v-col>
                    </v-row>
                    <!--
                                   ========================
                                     Mobile/Tablet View
                                   =========================
                            -->
                    <template v-else>
                        <v-row
                            class="mt-5 mx-0 text-subtitle-2 font-weight-regular justify-space-between align-start flex-nowrap"
                            :class="visibleDetails.has(transfer.transfer.transactionHash) ? 'mb-3' : 'mb-5'"
                            @click="toggleMoreDetails(transfer.transfer.transactionHash)"
                        >
                            <div class="flex-shrink-0">
                                <div class="d-flex align-center flex-nowrap mb-2">
                                    <div class="mobile-chip rounded-circle mr-2" :class="transferType(transfer) === 'in' ? 'bg-success' : 'bg-warning'">
                                        <v-icon size="12">
                                            {{ transferType(transfer) === 'in' ? 'south_east' : 'north_west' }}
                                        </v-icon>
                                    </div>
                                    <span>
                                        {{ transferType(transfer) === 'in' ? 'Received' : 'Sent' }}
                                    </span>
                                </div>
                                <p class="text-info">{{ timeAgo(new Date(transfer.transfer.timestamp * 1e3)) }}</p>
                            </div>
                            <v-col v-if="!visibleDetails.has(transfer.transfer.transactionHash)" cols="6" class="pa-0">
                                <p v-if="transfer.tokenInfo.name" class="text-center">{{ transfer.tokenInfo.name }}</p>
                            </v-col>
                            <div class="d-flex align-center">
                                <img :src="getImg(transfer)" alt="" height="41" width="41" class="mr-2 rounded-circle" />
                            </div>
                        </v-row>
                        <div v-if="visibleDetails.has(transfer.transfer.transactionHash)" class="row-bg bg-tableGrey"></div>
                        <div v-if="visibleDetails.has(transfer.transfer.transactionHash)">
                            <v-row class="mx-0 justify-space-between text-subtitle-2 font-weight-regular mb-2">
                                <p v-if="transfer.tokenInfo.name" class="text-center">{{ transfer.tokenInfo.name }}</p>
                                <p>{{ getTotalTokens(transfer) }} Copies</p>
                            </v-row>
                            <v-row class="ma-0 justify-space-between text-subtitle-2 font-weight-regular pb-5">
                                <div>
                                    <p class="text-info mb-2">From</p>
                                    <div class="d-flex">
                                        <app-address-blockie :address="eth.toCheckSum(transferTypeAddress(transfer)) || ''" :size="6" class="mr-2" />
                                        <app-transform-hash
                                            is-blue
                                            start="5"
                                            end="5"
                                            :hash="eth.toCheckSum(transferTypeAddress(transfer))"
                                            :link="`/address/${eth.toCheckSum(transferTypeAddress(transfer))}`"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p class="text-info mb-2">Hash</p>
                                    <app-transform-hash
                                        is-blue
                                        start="5"
                                        end="5"
                                        :hash="eth.toCheckSum(transfer.transfer.transactionHash)"
                                        :link="`/tx/${eth.toCheckSum(transfer.transfer.transactionHash)}`"
                                    />
                                </div>
                            </v-row>
                        </div>
                    </template>
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
import { formatNumber, FormattedNumber } from '@core/helper/number-format-helper'
import { useDisplay } from 'vuetify'
import { Erc721TransferFragmentFragment as Transfer, useGetAddressErc721TransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { eth, timeAgo } from '@core/helper'
import BN from 'bignumber.js'
import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import configs from '@/configs'

const MAX_ITEMS = 10
const OVERVIEW_MAX_ITEMS = 6
const MOBILE_MAX_ITEMS = 4
const TYPES = ['in', 'out', 'self']

const { smAndDown, mdAndDown } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    newErc721Transfer: Number,
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
} = useGetAddressErc721TransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: MAX_ITEMS
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getERC721Transfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getERC721Transfers.transfers || [])

const transfers = computed<Array<Transfer | null>>(() => {
    if (transferHistory.value.length > 0) {
        const start = OVERVIEW_MAX_ITEMS * state.index
        const end = start + OVERVIEW_MAX_ITEMS > transferHistory.value?.length ? transferHistory.value?.length : start + OVERVIEW_MAX_ITEMS
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

/**
 * Fetches image for the contract
 * @param transfer {Transfer}
 * @returns {TokenMarketData} or {undefined}
 */
const getImg = (transfer: Transfer): string => {
    if (!loadingTransfers.value && transfer) {
        const tokenId = new BN(transfer.token).toString()
        return `${configs.OPENSEA}/getImage?contract=${transfer.contract}&tokenId=${tokenId.toString()}`
    }
    return require('@/assets/icon-token.png')
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

const getTotalTokens = (transfer: Transfer): FormattedNumber | string => {
    return formatNumber(new BN(transfer.token).toNumber())
}

const setPage = (page: number, reset = false) => {
    if (reset) {
        refetch()
        emit('resetCount', AddressEventType.NewErc721Transfer, true)
    } else {
        if (page > state.index && hasMore.value) {
            fetchMore({
                variables: {
                    hash: props.addressHash,
                    _limit: MAX_ITEMS,
                    _nextKey: result.value?.getERC721Transfers?.nextKey
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    return {
                        getERC721Transfers: {
                            nextKey: fetchMoreResult?.getERC721Transfers.nextKey,
                            transfers: [...prev.getERC721Transfers.transfers, ...(fetchMoreResult?.getERC721Transfers.transfers || [])],
                            __typename: fetchMoreResult?.getERC721Transfers.__typename
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

const visibleDetails = ref(new Set())
const toggleMoreDetails = (transfer: string): void => {
    if (visibleDetails.value.has(transfer)) {
        visibleDetails.value.delete(transfer)
    } else {
        visibleDetails.value.add(transfer)
    }
}

const router = useRouter()
const goToNftTransfersPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_NFTS.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_NFTS[1] }
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
