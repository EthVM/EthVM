<template>
    <v-card variant="flat" class="pa-4 pa-sm-6">
        <!-- Pagination -->
        <!--        <v-row v-if="props.showPagination" justify="center" justify-md="end" row fill-height class="pb-1 pr-2 pl-2">-->
        <!--            <app-paginate-has-more :current-page="props.index" :has-more="props.hasMore" :loading="props.loading || props.hasError" @newPage="setPage" />-->
        <!--        </v-row>-->
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!props.hasError">
            <v-row align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
                <v-col sm="3" md="2"> Hash </v-col>
                <v-col sm="3" lg="2" class="d-none d-sm-block"> From </v-col>
                <v-spacer v-if="lgAndUp" />
                <v-col sm="3" lg="2" class="d-none d-sm-block"> To </v-col>
                <v-col sm="3" :md="isERC721 ? 1 : 2" :lg="isERC721 ? 1 : 3">
                    <template v-if="!isERC721">Amount</template>
                    <template v-else>ID</template>
                </v-col>
                <v-col v-if="isERC721" sm="2"> Image </v-col>
                <v-col md="2" class="d-none d-md-block"> Timestamp </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <!-- End Table Header -->

            <!-- Start Rows -->
            <template v-if="props.initialLoad">
                <div v-for="item in props.maxItems" :key="item" class="p-ten-top">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </div>
            </template>
            <div v-else class="p-ten-top">
                <div v-if="!props.hasItems && !props.loading">
                    <app-no-result text="No transfers available" class="mt-4 mt-sm-6"></app-no-result>
                </div>
                <div v-for="(transfer, index) in props.transfers" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row :transfer="transfer" :decimals="props.decimals" :symbol="props.symbol" :transfer-type="props.transferType" />
                </div>
                <!-- End Rows -->
                <app-intersect v-if="props.hasMore" @intersect="loadMoreData">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </app-intersect>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TransfersTableRow from './TokenTransferTableRow.vue'
import { useDisplay } from 'vuetify'

const TYPES = ['ERC20', 'ERC721']
const { lgAndUp } = useDisplay()

interface PropType {
    transfers: any[]
    hasItems: boolean
    hasMore: boolean
    showPagination: boolean
    loading: boolean
    initialLoad: boolean
    decimals?: number
    symbol?: string
    hasError: boolean
    maxItems: number
    index: number
    transferType: string
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'setPage', pageNumber: number, isReset: boolean): void
}>()

/**
 * Sets page number and reset value and emit
 * @param page {Number}
 * @param reset {Boolean}
 */
const setPage = (page: number, reset = false): void => {
    emit('setPage', page, reset)
}

const loadMoreData = (e: boolean): void => {
    if (e) {
        setPage(props.index + 1)
    }
}

const isERC721 = computed<boolean>(() => {
    return props.transferType === TYPES[1]
})
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
