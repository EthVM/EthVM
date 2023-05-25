<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-info d-none d-sm-flex">
            <v-col sm="6" md="3" :lg="props.isBlock ? 2 : 3" class="d-flex flex-nowrap">
                <p v-if="!mdAndDown && !props.isBlock">{{ $t('common.block') }}</p>
                <v-spacer v-if="!mdAndDown && !props.isBlock"></v-spacer>
                <p class="pl-8 pl-md-0" style="width: 116px">{{ $t('common.hash') }}</p>
            </v-col>
            <v-spacer v-if="!mdAndDown && !props.isBlock" />
            <v-col md="6" :lg="props.isBlock ? 5 : 4" class="d-none d-md-flex">
                <p style="width: 158px">{{ $t('common.from') }}</p>
                <v-spacer></v-spacer>
                <p style="width: 158px">{{ $t('common.to') }}</p>
            </v-col>
            <v-spacer v-if="!mdAndDown" />
            <v-col sm="3" lg="2">
                <p class="text-md-right text-lg-left pr-8 pr-lg-0">
                    {{ $t('common.amount') }}
                </p>
            </v-col>
            <v-col sm="3" lg="2" class="d-md-none d-lg-flex"> {{ $t('common.txFee') }} </v-col>
        </v-row>
        <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
        <!--
            =====================================================================================
              TABLE BODY
            =====================================================================================
        -->
        <div v-if="!hasMessage">
            <div v-if="!props.isLoading" class="p-ten-top">
                <template v-if="txsData.length > 0">
                    <div v-for="(tx, index) in txsData" :key="index">
                        <txs-table-row :tx="tx" :is-pending="props.pending" :is-block="props.isBlock" />
                    </div>
                </template>
                <app-no-result v-else text="This block does not have any transactions" class="mt-4 mt-sm-6" />
            </div>
            <div v-if="props.isLoading" class="p-ten-top">
                <div v-for="i in props.maxItems" :key="i" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" style="height: 40px"></div>
                </div>
            </div>
            <template v-if="props.showIntersect">
                <app-pagination :length="pages" :has-more="props.hasMore" @update:modelValue="$emit('loadMore', $event)" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import TxsTableRow from '@module/txs/components/TxsTableRow.vue'
import AppNoResult from '@core/components/AppNoResult.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed, PropType } from 'vue'
import { TransferFragment, BlockTransactionFragment } from '../apollo/transfersQuery.generated'

const { xs, mdAndDown } = useDisplay()

const props = defineProps({
    txsData: {
        type: Array as PropType<Array<BlockTransactionFragment | TransferFragment>>,
        default: () => []
    },
    isLoading: Boolean,
    maxItems: Number,
    pages: {
        type: Number,
        default: 0
    },
    address: {
        type: String,
        default: ''
    },
    tableMessage: {
        type: String,
        default: ''
    },
    pending: {
        type: Boolean,
        default: false
    },
    isScrollView: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    initialLoad: {
        type: Boolean,
        default: false
    },
    showIntersect: {
        type: Boolean,
        default: false
    },
    hasMore: {
        type: Boolean,
        default: false
    }
})

const hasMessage = computed<boolean>(() => {
    return props.tableMessage !== ''
})
</script>

<style scoped lang="css">
.tx-filter-select-container {
    border: solid 1px #efefef;
    padding-top: 1px;
}
.tx-status {
    min-width: 60px;
}

.scroll-y {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
