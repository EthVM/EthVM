<template>
    <div>
        <div v-if="!props.loading">
            <div v-if="props.logs.length > 0">
                <div v-for="(log, index) in currentPageData" :key="log.logIndex">
                    <tx-log-row :log="log" :index="index + LIMIT * (pageNum - 1) + 1"></tx-log-row>
                </div>
            </div>
            <div v-else class="mb-13 mb-sm-10">
                <app-no-result text="There are no logs found in this transaction" class="mx-4 mx-sm-6"></app-no-result>
            </div>
        </div>
        <template v-else>
            <div v-for="item in 3" :key="item" class="px-4 px-sm-6 mb-4 mb-sm-6">
                <div class="skeleton-box rounded-xl" style="height: 300px"></div>
            </div>
        </template>
        <app-pagination v-if="showPagination" :length="numberOfPages" @update:modelValue="loadMoreData" :current-page="pageNum" />
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TxLogRow from './components/TxLogRow.vue'
import { PropType, computed } from 'vue'
import { LogFragmentFragment as Log } from '@module/txs/apollo/TxDetails/TxDetails.generated'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
import AppPagination from '@core/components/AppPagination.vue'

const props = defineProps({
    txHash: {
        type: String,
        required: true
    },
    logs: {
        type: Array as PropType<Array<Log>>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: true
    }
})

const logs = computed<Log[]>(() => {
    return props.logs
})

/** -------------------
 * Pagination
 * --------------------*/
const LIMIT = 50
const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(logs, 'logs', LIMIT)

const loadMoreData = (page: number): void => {
    setPageNum(page)
}

const showPagination = computed<boolean>(() => {
    return logs.value.length > LIMIT
})
</script>
