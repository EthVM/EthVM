<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-body-1 text-info">
            <v-col sm="2"> Block # </v-col>
            <v-col sm="2"> Timestamp </v-col>
            <v-col sm="2"> Transactions </v-col>
            <v-col sm="3"> Miner </v-col>
            <v-col sm="3"> Reward </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        <!--
            =====================================================================================
              TABLE BODY
            =====================================================================================
        -->
        <div v-if="!hasMessage" class="p-ten-top">
            <template v-if="!props.isLoading">
                <div v-for="(block, index) in props.blockData" :key="index">
                    <table-blocks-row :block="block" :page-type="props.pageType" />
                </div>
            </template>
            <div v-if="props.isLoading">
                <div v-for="i in props.maxItems" :key="i">
                    <div class="skeleton-box rounded-xl my-4" style="height: 24px"></div>
                </div>
            </div>
            <app-intersect v-if="props.showIntersect" @intersect="$emit('loadMore')">
                <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                <v-divider />
            </app-intersect>
        </div>
    </div>
</template>

<script setup lang="ts">
import TableBlocksRow from '@/modules/block/components/RecentBlocks/BlocksTableRow.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'

const { xs } = useDisplay()

const props = defineProps({
    blockData: Array,
    isLoading: Boolean,
    maxItems: Number,
    index: Number,
    tableMessage: {
        type: String,
        default: ''
    },
    pageType: {
        type: String,
        default: 'home'
    },
    isScrollView: {
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
</script>

<style scoped lang="css">
.title-live {
    min-height: 60px;
}
.table-blocks-header-card {
    margin-right: 1px;
}
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
