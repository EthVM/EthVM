<template>
    <v-card flat class="pt-3 mt-0">
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
                <v-card v-if="!hasMessage" color="info" flat class="white--text pl-3 table-blocks-header-card" height="40px">
                    <v-row fill-height pr-3>
                        <v-col sm="2">
                            <h5>Block #</h5>
                        </v-col>
                        <v-spacer />
                        <v-col sm="2">
                            <h5>Transactions</h5>
                        </v-col>
                        <v-col sm="2">
                            <h5>Reward</h5>
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
        <v-container fluid v-if="!hasMessage" :style="getStyle" flat class="scroll-y pt-2 pr-2 pl-2 pb-0">
            <v-row column class="mb-1">
                <v-col>
                    <template v-if="!props.isLoading">
                        <div v-for="(block, index) in props.blockData" :key="index">
                            <table-blocks-row :block="block" :page-type="props.pageType" />
                        </div>
                    </template>
                    <div v-if="props.isLoading">
                        <div v-for="i in props.maxItems" :key="i">
                            <app-table-row-loading />
                        </div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script setup lang="ts">
import TableBlocksRow from '@/modules/block/components/RecentBlocks/BlocksTableRow.vue'
import AppTableRowLoading from '@core/components/AppTableRowLoading.vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'
const SCROLLVIEW = 'max-height: 450px'

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

const getStyle = computed<string>(() => {
    return props.isScrollView ? SCROLLVIEW : ''
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

.scroll-y {
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
