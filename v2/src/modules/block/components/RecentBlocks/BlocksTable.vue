<template>
    <div>
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
        <v-row v-if="!smAndDown" align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
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
        <v-container fluid v-if="!hasMessage" flat class="pt-2 pr-2 pl-2 pb-0">
            <v-row column class="mb-1">
                <v-col>
                    <template v-if="!props.isLoading">
                        <div v-for="(block, index) in props.blockData" :key="index">
                            <table-blocks-row :block="block" :page-type="props.pageType" />
                        </div>
                    </template>
                    <div v-if="props.isLoading">
                        <div v-for="i in props.maxItems" :key="i">
                            <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import TableBlocksRow from '@/modules/block/components/RecentBlocks/BlocksTableRow.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'

const { smAndDown } = useDisplay()

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
