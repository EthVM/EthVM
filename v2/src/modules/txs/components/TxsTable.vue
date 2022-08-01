<template>
    <v-card variant="flat" class="pt-3 mt-0">
        <!--
    =====================================================================================
      isLoading / ERROR
    =====================================================================================
    -->
        <!-- <app-error :has-error="hasMessage" :message="'error'" class="mb-4" /> -->
        <!--
    =====================================================================================
      TABLE HEADER
    =====================================================================================
    -->
        <v-row v-if="!smAndDown" sm12 class="my-0">
            <v-col>
                <v-card v-if="!hasMessage" color="info" variant="flat" class="white--text pl-3 table-blocks-header-card" height="40px">
                    <v-row class="my-0">
                        <v-col v-if="!props.pending" sm="2" lg="1">
                            <h5>Block #</h5>
                        </v-col>
                        <v-col sm="7" md="5">
                            <h5>Tx #</h5>
                        </v-col>
                        <v-col sm="3" lg="2">
                            <h5 class="pl-3">Amount</h5>
                        </v-col>
                        <v-col v-if="!smAndDown" md="2">
                            <h5 class="pl-2">Age</h5>
                        </v-col>
                        <v-col v-if="!mdAndDown" lg="1">
                            <h5>{{ props.pending ? 'Estimated Fee' : 'Tx Fee' }}</h5>
                        </v-col>
                        <v-col v-if="!props.pending" lg="1">
                            <h5 class="tx-status text-xs-center">Status</h5>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <!--
    =====================================================================================
      TABLE BODY
    =====================================================================================
    -->
        <div>
            <v-card v-if="!hasMessage" :style="getStyle" variant="flat" class="scroll-y pt-2 pr-2 pl-2 pb-0">
                <v-row class="ma-0">
                    <v-col v-if="!props.isLoading" xs="12">
                        <v-card v-for="(tx, index) in displayData" :key="index" variant="flat">
                            <txs-table-row :tx="tx" :is-pending="props.pending" />
                        </v-card>
                    </v-col>
                    <v-col v-else xs="12">
                        <div v-for="i in props.maxItems" :key="i">
                            <app-table-row-loading />
                        </div>
                    </v-col>
                </v-row>
            </v-card>
            <v-card v-else variant="plain">
                <v-card-title>{{ props.tableMessage }} </v-card-title>
                <v-divider class="ma-2 hidden-sm-and-down" />
            </v-card>
        </div>
    </v-card>
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
