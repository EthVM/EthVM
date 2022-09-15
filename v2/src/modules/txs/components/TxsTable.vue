<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!smAndDown" align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
            <v-col v-if="!props.pending" lg="2"> Block / Timestamp </v-col>
            <v-col lg="2"> Hash </v-col>
            <v-col lg="2"> From </v-col>
            <v-col lg="2"> To </v-col>
            <v-col lg="2"> Amount </v-col>
            <v-col lg="1"> Tx Fee </v-col>
            <v-col v-if="!props.pending" lg="1"> Status </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        <!--
            =====================================================================================
              TABLE BODY
            =====================================================================================
        -->
        <div v-if="!hasMessage">
            <v-row class="mb-1">
                <v-col v-if="!props.isLoading" xs="12">
                    <div v-for="(tx, index) in displayData" :key="index">
                        <txs-table-row :tx="tx" :is-pending="props.pending" />
                    </div>
                </v-col>
                <v-col v-else xs="12">
                    <div v-for="i in props.maxItems" :key="i">
                        <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                    </div>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import AppTableRowLoading from '@core/components/AppTableRowLoading.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'
import TxsTableRow from '@module/txs/components/TxsTableRow.vue'
const SCROLLVIEW = 'max-height: 450px'

const { smAndDown, mdAndDown } = useDisplay()

const props = defineProps({
    txsData: Array,
    isLoading: Boolean,
    maxItems: Number,
    index: Number,
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
    }
})

const hasMessage = computed<boolean>(() => {
    return props.tableMessage !== ''
})

const getStyle = computed<string>(() => {
    return props.isScrollView ? SCROLLVIEW : ''
})

const displayData = computed<any[]>(() => {
    if (props.txsData) {
        const start = props.index * props.maxItems
        const end = start + props.maxItems > props.txsData.length ? props.txsData.length : start + props.maxItems
        return props.txsData.slice(start, end)
    }
    return []
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
