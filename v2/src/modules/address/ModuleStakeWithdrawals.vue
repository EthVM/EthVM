<template>
    <div>
        <template v-if="!xs">
            <v-row align="center" justify="start" class="text-info mt-2 mt-sm-3">
                <v-col sm="3" lg="2"> Status </v-col>
                <v-col sm="2" md="3" lg="3"> Validator</v-col>
                <v-col sm="4" md="3" lg="5"> Value</v-col>
                <v-col sm="3" lg="2"> Block </v-col>
            </v-row>
        </template>
        <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
        <div v-if="!initialLoad && !loadingWithdrawals" class="p-ten-top">
            <template v-if="withdrawals && withdrawals.length > 0">
                <div
                    v-for="(withdrawal, index) in currentPageData"
                    :key="`${withdrawal?.validatorIndex}-${withdrawal?.value}-${withdrawal?.transfer.block}-${index}`"
                >
                    <table-row-stake-withdrawals :withdrawal="withdrawal" />
                </div>
            </template>
            <app-no-result v-else text="This address does not have any stake withdrawals" class="mt-4 mt-sm-6 mb-5"></app-no-result>
        </div>
        <div v-else class="p-ten-top">
            <div v-for="item in 10" :key="item" style="padding: 10px 0">
                <div class="skeleton-box rounded-xl" :style="xs ? 'height: 72px' : 'height: 52px'"></div>
            </div>
        </div>
        <template v-if="showPagination">
            <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
        </template>
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TableRowStakeWithdrawals from './components/TableRowStakeWithdrawals.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { computed } from 'vue'
import { AdrWithdrawalFragment, useGetAdrWithdrawalsQuery } from '@module/address/apollo/AddressWithdrawals/withdrawals.generated'
import { useDisplay } from 'vuetify'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import { ITEMS_PER_PAGE } from '@core/constants'

const { xs } = useDisplay()

const props = defineProps({
    addressRef: {
        type: String,
        required: true
    }
})

const {
    result: resultWithdrawals,
    loading: loadingWithdrawals,
    fetchMore: fetchMoreWithdrawals
} = useGetAdrWithdrawalsQuery(
    () => ({
        address: props.addressRef,
        limit: ITEMS_PER_PAGE
    }),
    {
        notifyOnNetworkStatusChange: true
    }
)

const withdrawals = computed<Array<AdrWithdrawalFragment>>(() => {
    return resultWithdrawals.value?.getEthWithdrawalTransfers.transfers || []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(withdrawals, 'stake-withdrawals')

const initialLoad = computed<boolean>(() => {
    return !resultWithdrawals.value
})

const showPagination = computed<boolean>(() => {
    return !initialLoad.value && withdrawals.value && withdrawals.value.length > 0
})

const hasMore = computed<boolean>(() => {
    return !!resultWithdrawals.value?.getEthWithdrawalTransfers.nextKey
})

const loadMoreWithdrawals = (): void => {
    fetchMoreWithdrawals({
        variables: {
            address: props.addressRef,
            limit: ITEMS_PER_PAGE,
            nextKey: resultWithdrawals.value?.getEthWithdrawalTransfers.nextKey
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

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    if (pageNum > numberOfPages.value && hasMore.value) {
        loadMoreWithdrawals()
    }
}
</script>
