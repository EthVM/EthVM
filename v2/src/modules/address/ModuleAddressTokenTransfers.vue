<template>
    <v-card :variant="!props.isOverview ? 'flat' : 'elevated'" :elevation="props.isOverview ? 1 : 0" rounded="xl" class="pa-4 pa-sm-6 fill-height">
        <v-card-title class="d-flex justify-space-between align-center pa-0 mb-5">
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
            <app-btn v-if="props.isOverview && !xs" text="More" isSmall icon="east" @click="goToTokenTransfersPage"></app-btn>
            <app-btn-icon v-if="props.isOverview && xs" icon="more_horiz" @click="goToTokenTransfersPage"></app-btn-icon>
        </v-card-title>
        <div class="mb-n5">
            <!--            Table Header-->

            <v-row v-if="!mdAndDown" class="my-0 text-body-1 text-info">
                <v-col :cols="props.isOverview ? 3 : 2" class="py-0"> Token </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="py-0"> Symbol </v-col>
                <v-col :cols="props.isOverview ? 3 : 2" class="py-0"> Amount </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0"> From/To </v-col>
                <v-col :cols="props.isOverview ? 4 : 2" class="py-0"> Address </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="py-0"> Hash </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="py-0"> Timestamp </v-col>
                <v-col v-if="!props.isOverview" cols="1" class="py-0 text-right"> More </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-5 mx-n4 mx-sm-n6" />
            <div v-if="initialLoad || loadingTransfers" class="p-ten-top">
                <div v-for="item in 10" :key="item" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" style="height: 34px"></div>
                </div>
            </div>
            <template v-else-if="!initialLoad && renderState.renderTable">
                <div v-if="transfers.length > 0" class="p-ten-top">
                    <div v-for="(transfer, index) in currentPageData" :key="`${transfer.transfer.transactionHash} - ${index}`">
                        <address-token-transfers-row
                            :transfer="transfer"
                            :index="index"
                            :token-img="tokenImg"
                            :is-overview="props.isOverview"
                            :address-hash="props.addressHash"
                        />
                    </div>
                </div>
                <app-no-result v-else text="This address does not have any token transfer history" class="mt-4 mt-sm-6 mb-5"></app-no-result>
            </template>
            <template v-if="showPagination">
                <app-pagination :length="numberOfPages" :has-next="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AddressBalanceTotals from './components/AddressBalanceTotals.vue'
import AppPagination from '@core/components/AppPagination.vue'
import AddressTokenTransfersRow from './components/TableRowAddressTokenTransfers.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { useDisplay } from 'vuetify'
import { TransferFragmentFragment as Transfer, useGetAddressErc20TransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import { useAppTableRowRender } from '@core/composables/AppTableRowRender/useAppTableRowRender.composable'
import AppNoResult from '@/core/components/AppNoResult.vue'
import { useStore } from '@/store'
import { WatchQueryFetchPolicy } from '@apollo/client/core'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const { getEthereumTokensMap } = useCoinData()

const MAX_ITEMS = 10
const OVERVIEW_MAX_ITEMS = 7
const MOBILE_MAX_ITEMS = 4

const { mdAndDown, xs } = useDisplay()
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

const store = useStore()
const queryPolicy = computed<WatchQueryFetchPolicy>(() => {
    return store.addressHashIsSaved(props.addressHash.toLowerCase()) || props.isOverview ? 'cache-only' : 'cache-first'
})
const { addressHash } = toRefs(props)
const { tokenBalanceValue, tokenCount, initialLoad: loadingAddressTokens } = useAddressToken(addressHash, queryPolicy)
const { loading: loadingMarketInfo } = useCoinData()

const {
    result,
    loading: loadingTransfers,
    fetchMore,
    refetch
} = useGetAddressErc20TransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getERC20Transfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getERC20Transfers.transfers || [])

/**
 * Render State Tracking
 */

const transfersLength = computed<number>(() => {
    return transferHistory.value.length
})

const { renderState } = useAppTableRowRender(transfersLength.value)

const transfers = computed<Array<Transfer | null>>(() => {
    if (transferHistory.value.length > 0) {
        // If on mobile screen and on overview page
        if (mdAndDown.value && props.isOverview) {
            return transferHistory.value.slice(0, MOBILE_MAX_ITEMS)
        }
        if (props.isOverview) {
            return transferHistory.value.slice(0, OVERVIEW_MAX_ITEMS)
        }
        return transferHistory.value
    }
    return []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, 'tokenTransfers')

/*
 * Initial load will be true only when the data is being loaded initially
 */
const initialLoad = computed<boolean>(() => {
    return !result.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !!transfers.value && transfers.value.length > 0 && !props.isOverview
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

const setPage = (page: number, reset = false) => {
    if (reset) {
        refetch()
        emit('resetCount', AddressEventType.NewErc20Transfer, true)
    } else {
        if (pageNum.value > numberOfPages.value && hasMore.value) {
            fetchMore({
                variables: {
                    hash: props.addressHash,
                    _limit: ITEMS_PER_PAGE,
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
}

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    setPage(pageNum)
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
</style>
