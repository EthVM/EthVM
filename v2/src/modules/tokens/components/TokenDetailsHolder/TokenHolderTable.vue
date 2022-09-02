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
                <v-col md="3"> Address </v-col>
                <v-col sm="3" lg="4">
                    {{ isERC721 ? 'ID' : 'Quantity' }}
                </v-col>
                <v-col md="3"> USD Value </v-col>
                <v-col sm="3" lg="2">
                    {{ isERC721 ? 'Image' : 'Percentage' }}
                </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
            <!-- End Table Header -->

            <!-- Start Rows -->
            <template v-if="props.initialLoad">
                <div v-for="item in props.maxItems" :key="item" class="my-2">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </div>
            </template>
            <div v-else>
                <div v-if="!props.hasItems && !props.loading">
                    <v-card-text class="text-xs-center secondary--text">There are no holders of this token</v-card-text>
                </div>
                <div v-for="(holder, index) in props.holders" v-else :key="index">
                    <holders-table-row :holder="holder" :token-address="props.address" :decimals="props.decimals" :holder-type="props.holderType" />
                </div>
                <app-intersect v-if="props.hasMore" @intersect="loadMoreData">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                    <v-divider />
                </app-intersect>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import HoldersTableRow from './TokenHolderTableRow.vue'
const TYPES = ['ERC20', 'ERC721']

interface PropType {
    holders: any[]
    hasItems: boolean
    hasMore: boolean
    showPagination: boolean
    loading: boolean
    initialLoad: boolean
    decimals?: number
    hasError: boolean
    maxItems: number
    index: number
    address: string
    holderType: string
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
    return props.holderType === TYPES[1]
})
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
