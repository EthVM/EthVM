<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-info d-none d-sm-flex">
            <v-col v-if="!props.pending && !props.isBlock" sm="3" lg="2"> Block / Timestamp </v-col>
            <v-col sm="3" md="2"> Hash </v-col>
            <v-col v-if="!mdAndDown" lg="2"> From </v-col>
            <v-spacer v-if="props.isBlock" />
            <v-col v-if="!mdAndDown" lg="2"> To </v-col>
            <v-col lg="2"> Amount </v-col>
            <v-col :lg="props.isBlock ? 2 : 1"> Tx Fee </v-col>
            <v-col v-if="!props.pending" lg="1"> Status </v-col>
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
import { computed } from 'vue'

const { xs, mdAndDown } = useDisplay()

const props = defineProps({
    txsData: Array,
    isLoading: Boolean,
    maxItems: Number,
    index: Number,
    pages: Number,
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
