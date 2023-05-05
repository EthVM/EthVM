<template>
    <div>
        <div v-if="!actionsLoading">
            <app-expansion-panel v-if="ethTransfers.length > 0" :title="`${currencyName} Transfers`" class="pt-3">
                <template #visible-content>
                    <div v-for="(transfer, index) in currentPageData.slice(0, 3)" :key="`${index}`">
                        <tx-action-row :transfer="transfer" />
                    </div>
                </template>
                <template #expand-content v-if="ethTransfers.length > 3">
                    <div v-if="!initialLoadingEthTransfers && !loadingEthTransfersData">
                        <template v-if="ethTransfers">
                            <div v-for="(transfer, index) in currentPageData.slice(3, LIMIT)" :key="`${index}`">
                                <tx-action-row :transfer="transfer" />
                            </div>
                        </template>
                    </div>
                    <div v-else class="p-ten-top">
                        <div v-for="item in LIMIT" :key="item" style="padding: 10px 0">
                            <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                        </div>
                    </div>
                    <template v-if="showPaginationEthTransfers">
                        <app-pagination
                            :length="numberOfPages"
                            :has-more="hasMoreEthTransfers"
                            @update:modelValue="loadMoreEthTransfers"
                            :current-page="pageNum"
                        />
                    </template>
                </template>
            </app-expansion-panel>
            <app-no-result v-if="!hasActions" text="There are no actions performed in this transaction" class="mt-4 mt-sm-6 mb-5"></app-no-result>
        </div>
        <template v-else>
            <div v-for="item in 3" :key="item" class="px-4 px-sm-6 mb-4 mb-sm-6">
                <div class="skeleton-box rounded-xl" style="height: 300px"></div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import AppExpansionPanel from '@/core/components/AppExpansionPanel.vue'
import TxActionRow from './components/TxActionRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import { EthTransferInTxFragment as EthTransfer, useGetEthTransfersInTxQuery } from '@module/txs/apollo/Actions/actionsQueries.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { Action } from './types/index'
import { useNetwork } from '@/core/composables/Network/useNetwork'
const LIMIT = 20
const { currencyName } = useNetwork()

const props = defineProps({
    txHash: {
        type: String,
        required: true
    }
})

// const state = reactive({
//     showActions: false,
//     loadingEthTransfers: true
// })

/** -------------------
 * Eth Transfers
 * --------------------*/

const {
    result: ethTransfersData,
    loading: loadingEthTransfersData,
    fetchMore: fetchMoreEthTransfersData
} = useGetEthTransfersInTxQuery(
    () => ({
        hash: props.txHash,
        limit: LIMIT
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const ethTransfers = computed<Action[]>(() => {
    return (
        ethTransfersData.value?.getEthTransfersByHash.transfers
            .filter((x): x is EthTransfer => x !== null)
            .map(i => {
                return {
                    from: i.transfer.from,
                    to: i.transfer.to,
                    value: i.value,
                    type: i.transfer.type
                }
            }) || []
    )
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(ethTransfers, 'ethTransfers', LIMIT)

const initialLoadingEthTransfers = computed<boolean>(() => {
    return !ethTransfersData.value
})

const hasMoreEthTransfers = computed<boolean>(() => {
    return !!ethTransfersData.value?.getEthTransfersByHash.nextKey
})

const showPaginationEthTransfers = computed<boolean>(() => {
    return !initialLoadingEthTransfers.value && (ethTransfers.value.length > LIMIT || hasMoreEthTransfers.value)
})

const loadMoreEthTransfers = (pageNum: number): void => {
    setPageNum(pageNum)
    if (pageNum > numberOfPages.value && hasMoreEthTransfers.value) {
        fetchMoreEthTransfersData({
            variables: {
                hash: props.txHash,
                nextKey: ethTransfersData.value?.getEthTransfersByHash.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getEthTransfersByHash: {
                        nextKey: fetchMoreResult?.getEthTransfersByHash.nextKey,
                        transfers: [...prev.getEthTransfersByHash.transfers, ...(fetchMoreResult?.getEthTransfersByHash.transfers || [])],
                        __typename: fetchMoreResult?.getEthTransfersByHash.__typename
                    }
                }
            }
        })
    }
}

/** -------------------
 * Actions
 * --------------------*/
const actionsLoading = computed<boolean>(() => {
    return initialLoadingEthTransfers.value
})

const hasActions = computed<boolean>(() => {
    return ethTransfers.value.length > 0
})
</script>
