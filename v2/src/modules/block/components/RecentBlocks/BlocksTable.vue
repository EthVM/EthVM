<template>
    <div>
        <!--
            =====================================================================================
              TABLE HEADER
            =====================================================================================
        -->
        <v-row v-if="!xs" align="center" justify="start" class="text-body-1 text-info">
            <v-col> Block # </v-col>
            <v-col v-if="!mdAndDown" sm="2"> Timestamp </v-col>
            <v-col sm="3" lg="2"> Transactions </v-col>
            <v-col sm="4" lg="3"> Miner </v-col>
            <v-col sm="3"> Reward </v-col>
        </v-row>
        <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        <!--
            =====================================================================================
              TABLE BODY
            =====================================================================================
        -->
        <div v-if="!hasMessage">
            <div v-if="!props.isLoading" class="p-ten-top">
                <div v-for="(block, index) in props.blockData" :key="index">
                    <table-blocks-row :block="block" :page-type="props.pageType" />
                </div>
            </div>
            <div v-if="props.isLoading" style="padding-top: 6px">
                <div v-for="i in props.maxItems" :key="i">
                    <div class="skeleton-box rounded-xl my-5" style="height: 32px"></div>
                </div>
            </div>
            <template v-if="props.showIntersect">
                <app-pagination :length="pages" :has-more="props.hasMore" @update:modelValue="handlePageChange" />
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import TableBlocksRow from '@/modules/block/components/RecentBlocks/BlocksTableRow.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'

const { xs, mdAndDown } = useDisplay()

const props = defineProps({
    blockData: Array,
    isLoading: Boolean,
    initialLoad: Boolean,
    maxItems: Number,
    pages: Number,
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
    },
    hasMore: {
        type: Boolean,
        default: false
    }
})

const hasMessage = computed<boolean>(() => {
    return props.tableMessage !== ''
})

const emit = defineEmits<{
    (e: 'loadMore', page: number): void
}>()

const handlePageChange = (page: number) => {
    emit('loadMore', page)
}
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
