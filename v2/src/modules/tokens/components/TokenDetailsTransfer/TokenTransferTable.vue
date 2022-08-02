<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
        <!-- Pagination -->
        <v-row v-if="props.showPagination" justify="center" justify-md="end" row fill-height class="pb-1 pr-2 pl-2">
            <app-paginate-has-more :current-page="props.index" :has-more="props.hasMore" :loading="props.loading || props.hasError" @newPage="setPage" />
        </v-row>
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!props.hasError">
            <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2 hidden-sm-and-down" height="40px">
                <v-row align="center" justify="start" class="fill-height pr-2">
                    <v-col :class="[sm || xs ? 'pr-3' : 'pr-5']" sm="6" :md="isERC721 ? 6 : 7">
                        <h5>Tx #</h5>
                    </v-col>
                    <v-col sm="2">
                        <h5>Age</h5>
                    </v-col>
                    <v-col sm="2">
                        <h5 v-if="!isERC721">Quantity</h5>
                        <h5 v-else>ID</h5>
                    </v-col>
                    <v-col v-if="isERC721" sm="2">
                        <h5>Image</h5>
                    </v-col>
                </v-row>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <div v-if="props.loading || props.hasError">
                <v-col sm="12">
                    <div v-for="i in props.maxItems" :key="i" :class="[sm || xs ? 'table-row-mobile mb-2' : '']">
                        <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="ma-2" />
                    </div>
                </v-col>
            </div>
            <div v-else>
                <v-card v-if="!props.hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">No transfers</v-card-text>
                </v-card>
                <v-card v-for="(transfer, index) in props.transfers" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row :transfer="transfer" :decimals="props.decimals" :symbol="props.symbol" :transfer-type="props.transferType" />
                </v-card>
                <!-- End Rows -->
                <v-row v-if="props.showPagination" justify="center" justify-md="end" row class="pb-1 pr-2 pl-2">
                    <app-paginate-has-more
                        :current-page="props.index"
                        :has-more="props.hasMore"
                        :loading="props.loading || props.hasError"
                        @newPage="setPage"
                    />
                </v-row>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import TransfersTableRow from './TokenTransferTableRow.vue'
import { useDisplay } from 'vuetify'

const { xs, sm } = useDisplay()
const TYPES = ['ERC20', 'ERC721']

interface PropType {
    transfers: any[]
    hasItems: boolean
    hasMore: boolean
    showPagination: boolean
    loading: boolean
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

const isERC721 = computed<boolean>(() => {
    return props.transferType === TYPES[1]
})
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
