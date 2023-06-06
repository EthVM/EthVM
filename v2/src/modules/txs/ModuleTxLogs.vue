<template>
    <div>
        <div v-if="!props.loading">
            <div v-if="props.logs.length > 0">
                <div v-for="(log, index) in props.logs" :key="log.logIndex">
                    <tx-log-row :log="log" :index="index"></tx-log-row>
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
    </div>
</template>

<script setup lang="ts">
import AppNoResult from '@core/components/AppNoResult.vue'
import TxLogRow from './components/TxLogRow.vue'
import { PropType } from 'vue'
import { LogFragmentFragment as Log } from '@module/txs/apollo/TxDetails/TxDetails.generated'

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
</script>
