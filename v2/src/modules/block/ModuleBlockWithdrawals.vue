<template>
    <div class="pa-4 pa-sm-6">
        <!--
        =====================================================================================
            TABLE HEADER
        =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-info d-none d-sm-flex">
            <v-col sm="2">Validator </v-col>
            <v-spacer />
            <v-col sm="5" lg="6"> {{ t('common.to') }} </v-col>
            <v-col sm="3" lg="2"> Value </v-col>
        </v-row>
        <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
        <!--
        =====================================================================================
            TABLE BODY
        =====================================================================================
        -->
        <div v-if="!isLoading" class="p-ten-top">
            <template v-if="hasWithdrawals">
                <div v-for="(transfer, index) in currentPageData" :key="index">
                    <block-withdrawal-row :transfer="transfer" />
                </div>
            </template>
            <app-no-result v-else text="This block does not have any withdrawals" class="mt-4 mt-sm-6" />
        </div>
        <div v-if="isLoading" class="p-ten-top">
            <div v-for="i in 10" :key="i" style="padding: 10px 0px">
                <div class="skeleton-box rounded-xl" style="height: 40px"></div>
            </div>
        </div>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </div>
</template>
<script setup lang="ts">
import AppNoResult from '@/core/components/AppNoResult.vue'
import AppPagination from '@/core/components/AppPagination.vue'
import BlockWithdrawalRow from './components/BlockWithdrawalRow.vue'
import { computed, ref } from 'vue'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { useGetBlockWithdrawalsQuery, BlockWithdrawalFragment } from './apollo/BlockWithdrawals/blockWithdrawals.generated'
import { useNewTransfersCompleteFeedSubscription } from '@module/txs/apollo/transfersQuery.generated'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { xs } = useDisplay()

const props = defineProps({
    blockNumber: {
        type: Number,
        required: true
    },
    isMined: {
        type: Boolean,
        required: true
    },
    blockHasWithdrawals: {
        type: Boolean,
        required: true,
        default: true
    }
})

/*
 * =======================================================
 * Fetch Withdrawals
 * =======================================================
 */

const isProcessedBlock = ref(true)
const {
    result,
    loading,
    fetchMore,
    onResult: onWithdrawalsResult,
    refetch
} = useGetBlockWithdrawalsQuery(
    () => ({
        blockNumber: props.blockNumber
    }),
    () => ({
        notifyOnNetworkStatusChange: true,
        enabled: props.isMined
    })
)

onWithdrawalsResult(() => {
    if (props.blockHasWithdrawals && !hasWithdrawals.value) {
        isProcessedBlock.value = false
    } else {
        isProcessedBlock.value = true
    }
})

const isLoading = computed<boolean>(() => {
    return isProcessedBlock.value && props.isMined ? loading.value : true
})

const hasWithdrawals = computed<boolean>(() => {
    return !!result.value?.getEthWithdrawalTransfers?.transfers && result.value?.getEthWithdrawalTransfers?.transfers.length > 0
})

const withdrawals = computed<BlockWithdrawalFragment[]>(() => {
    return result.value?.getEthWithdrawalTransfers.transfers || []
})

const hasMore = computed<boolean>(() => {
    return !!result.value?.getEthWithdrawalTransfers.nextKey
})

const { onResult: onNewTransfersLoaded } = useNewTransfersCompleteFeedSubscription(() => ({
    enabled: !isProcessedBlock.value
}))

onNewTransfersLoaded(result => {
    const res = result?.data?.newTransfersCompleteFeed
    if (res && res.block >= props.blockNumber && res.type === 'ETH') {
        refetch()
        isProcessedBlock.value = true
    }
})

/*
 * =======================================================
 * Pagination
 * =======================================================
 */
const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(withdrawals)

const showPagination = computed<boolean>(() => {
    return withdrawals.value.length > 10 ? true : hasMore.value
})

const loadMoreData = (_pageNum: number): void => {
    setPageNum(_pageNum)
    fetchMoreWithdrawals(_pageNum)
}

const fetchMoreWithdrawals = (page: number) => {
    if (page > numberOfPages.value && hasMore.value) {
        fetchMore({
            variables: {
                blockNumber: props.blockNumber,
                nextKey: result.value?.getEthWithdrawalTransfers.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getEthWithdrawalTransfers: {
                        nextKey: fetchMoreResult?.getEthWithdrawalTransfers.nextKey,
                        transfers: [...prev.getEthWithdrawalTransfers.transfers, ...(fetchMoreResult?.getEthWithdrawalTransfers.transfers || [])],
                        __typename: fetchMoreResult?.getEthWithdrawalTransfers.__typename
                    }
                }
            }
        })
    }
}
</script>
<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}
</style>
