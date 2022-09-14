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
                    <v-col sm="6">
                        <h5>Address</h5>
                    </v-col>
                    <v-col sm="3" md="4">
                        <h5>
                            {{ isERC721 ? 'ID' : 'Quantity' }}
                        </h5>
                    </v-col>
                    <v-col sm="3" md="2">
                        <h5>
                            {{ isERC721 ? 'Image' : 'Percentage' }}
                        </h5>
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
                    <v-card-text class="text-xs-center secondary--text">There are no holders of this token</v-card-text>
                </v-card>
                <v-card v-for="(holder, index) in props.holders" v-else :key="index" color="white" class="transparent" flat>
                    <holders-table-row :holder="holder" :token-address="props.address" :decimals="props.decimals" :holder-type="props.holderType" />
                </v-card>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPaginateHasMore from '@core/components/AppPaginateHasMore.vue'
import HoldersTableRow from './TokenHolderTableRow.vue'
import { useDisplay } from 'vuetify'

const { xs, sm } = useDisplay()
const TYPES = ['ERC20', 'ERC721']

interface PropType {
    holders: any[]
    hasItems: boolean
    hasMore: boolean
    showPagination: boolean
    loading: boolean
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

const isERC721 = computed<boolean>(() => {
    return props.holderType === TYPES[1]
})
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
