<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
            <v-col v-if="!props.pending && !props.isBlock" sm="3" lg="2"> Block / Timestamp </v-col>
            <v-col sm="3" lg="2"> Hash </v-col>
            <v-col v-if="!mdAndDown" lg="2"> From </v-col>
            <v-spacer v-if="props.isBlock" />
            <v-col v-if="!mdAndDown" lg="2"> To </v-col>
            <v-col lg="2"> Amount </v-col>
            <v-col :lg="props.isBlock ? 2 : 1"> Tx Fee </v-col>
            <v-col v-if="!props.pending" lg="1"> Status </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        <!--
            =====================================================================================
              TABLE BODY
            =====================================================================================
        -->
        <div v-if="!hasMessage">
            <template v-if="!props.isLoading">
                <div v-for="(tx, index) in displayData" :key="index">
                    <txs-table-row :tx="tx" :is-pending="props.pending" :is-block="props.isBlock" />
                </div>
            </template>
            <template v-if="props.isLoading">
                <div v-for="i in props.maxItems" :key="i" class="my-5">
                    <div class="skeleton-box rounded-xl mt-1" style="height: 24px"></div>
                </div>
            </template>
            <app-intersect v-if="props.showIntersect" @intersect="$emit('loadMore')">
                <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                <v-divider />
            </app-intersect>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'
import TxsTableRow from '@module/txs/components/TxsTableRow.vue'
import AppIntersect from '@core/components/AppIntersect.vue'

const { xs, mdAndDown } = useDisplay()

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
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    showIntersect: {
        type: Boolean,
        default: false
    }
})

const hasMessage = computed<boolean>(() => {
    return props.tableMessage !== ''
})

const displayData = computed<any[]>(() => {
    if (props.isBlock && props.txsData) {
        const maxItems = props.maxItems || 10
        const index = props.index || 0
        const end = index * maxItems || props.maxItems
        return props.txsData.slice(0, end)
    }
    return props.txsData || []
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
