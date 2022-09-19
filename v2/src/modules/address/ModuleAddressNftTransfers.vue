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
                <template v-if="transfers.length < 1">
                    <p class="text-h4 text-center my-2">This address does not hold any NFTs (ERC721 tokens)</p>
                </template>
                <template v-else>
                    <div v-for="(transfer, index) in transfers" :key="`${transfer.transfer.transactionHash} - ${index}`" class="position-relative">
                        <nft-transfers-table-row :transfer="transfer" :is-overview="props.isOverview" :address-hash="props.addressHash" />
                    </div>
                    <app-intersect v-if="!props.isOverview && hasMore" @intersect="loadMoreData">
                        <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                        <v-divider />
                    </app-intersect>
                </template>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import NftTransfersTableRow from '@module/address/components/TableRowNftTransfers.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { useDisplay } from 'vuetify'
import { Erc721TransferFragmentFragment as Transfer, useGetAddressErc721TransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'

const MAX_ITEMS = 10
const OVERVIEW_MAX_ITEMS = 6
const MOBILE_MAX_ITEMS = 4

const { mdAndDown } = useDisplay()
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

const { result, fetchMore, refetch } = useGetAddressErc721TransfersQuery(
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
</style>
