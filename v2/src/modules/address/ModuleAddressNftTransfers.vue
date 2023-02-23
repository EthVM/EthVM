<template>
    <v-card
        :variant="!props.isOverview ? 'flat' : 'elevated'"
        :elevation="props.isOverview ? 1 : 0"
        rounded="xl"
        :class="[props.isOverview ? 'pt-4 pt-sm-6' : '', 'px-4 px-sm-6 pb-4 pb-sm-6 h-100']"
    >
        <v-card-title v-if="props.isOverview" class="d-flex justify-space-between align-center pa-0 mb-5">
            <div>
                <v-row align="center" class="my-0 mx-0">
                    <span class="text-h6 font-weight-bold">NFT History</span>
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
        <div>
            <!--            Table Header-->

            <v-row v-if="!mdAndDown" class="my-0 text-body-1 text-info">
                <v-col :cols="props.isOverview ? 4 : 3" class="py-0"> Name/Id </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0"> Copies </v-col>
                <v-col :cols="props.isOverview ? 2 : 1" class="py-0"> From/To </v-col>
                <v-col :cols="props.isOverview ? 4 : 3" class="py-0"> Address </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="py-0"> Hash </v-col>
                <v-col v-if="!props.isOverview" cols="2" class="py-0"> Timestamp </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-5 mx-n4 mx-sm-n6" />
            <div v-if="initialLoad || loadingMeta || loadingTransfers" class="p-ten-top">
                <div v-for="item in 10" :key="item" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                </div>
            </div>
            <template v-else>
                <template v-if="transfers.length < 1">
                    <app-no-result text="This address does not have any NFT transfer history" class="mt-4 mt-sm-6"></app-no-result>
                </template>
                <div v-else-if="transfers.length > 0" class="p-ten-top">
                    <div v-for="(transfer, index) in currentPageData" :key="`${transfer?.transfer.transactionHash} - ${index}`">
                        <nft-transfers-table-row
                            v-if="transfer"
                            :transfer="transfer"
                            :nft-meta="getRowMeta(transfer.contract, transfer.tokenId)"
                            :meta-is-loading="loadingMeta"
                            :is-overview="props.isOverview"
                            :address-hash="props.addressHash"
                        />
                    </div>
                </div>
            </template>
            <template v-if="showPagination">
                <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs } from 'vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import NftTransfersTableRow from '@module/address/components/TableRowNftTransfers.vue'
import AppPagination from '@core/components/AppPagination.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { useDisplay } from 'vuetify'
import { NftTransferFragmentFragment as Transfer, useGetAddressNftTransfersQuery } from './apollo/AddressTransfers/transfers.generated'
import { AddressEventType } from '@/apollo/types'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftMetaFragment } from '@core/composables/NftMeta/nftMeta.generated'
import { NftId, generateId, generateMapId } from '@/core/composables/NftMeta/helpers'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const OVERVIEW_MAX_ITEMS = 7
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

const {
    result,
    fetchMore,
    refetch,
    loading: loadingTransfers
} = useGetAddressNftTransfersQuery(
    () => ({
        hash: props.addressHash,
        _limit: ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

const hasMore = computed<boolean>(() => {
    return result.value?.getNFTTransfers.nextKey !== null
})

const transferHistory = computed<Array<Transfer | null>>(() => result.value?.getNFTTransfers.transfers || [])

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

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(transfers, 'nftTransfers')

/**
 * Computed Property of token ids to fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (!loadingTransfers.value && result.value && generateId) {
        currentPageData.value.forEach(i => {
            if (i) {
                const id = {
                    id: generateId(i.tokenId),
                    contract: i.contract
                }
                _ids.push(id)
            }
        })
    }
    return _ids
})

const { nftMeta, loadingMeta } = useGetNftsMeta(tokenIDS, loadingTransfers)

const getRowMeta = (contract: string, id: string): NftMetaFragment | undefined => {
    return nftMeta.value.get(generateMapId(contract, id))
}

/*
 * Initial load will be true only when the data is being loaded initially
 */
const initialLoad = computed<boolean>(() => {
    return !result.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && !!transfers.value && transfers.value.length > 0 && !props.isOverview
})

const setPage = (page: number, reset = false) => {
    if (reset) {
        refetch()
        emit('resetCount', AddressEventType.NewErc721Transfer, true)
    } else {
        if (pageNum.value > numberOfPages.value && hasMore.value) {
            fetchMore({
                variables: {
                    hash: props.addressHash,
                    _limit: ITEMS_PER_PAGE,
                    _nextKey: result.value?.getNFTTransfers.nextKey
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    return {
                        getNFTTransfers: {
                            nextKey: fetchMoreResult?.getNFTTransfers.nextKey,
                            transfers: [...prev.getNFTTransfers.transfers, ...(fetchMoreResult?.getNFTTransfers.transfers || [])],
                            __typename: fetchMoreResult?.getNFTTransfers.__typename
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
