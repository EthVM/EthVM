<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
        <!-- Pagination -->
        <v-layout
            v-if="showPagination"
            :justify-end="$vuetify.breakpoint.mdAndUp"
            :justify-center="$vuetify.breakpoint.smAndDown"
            row
            fill-height
            class="pb-1 pr-2 pl-2"
        >
            <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading || hasError" @newPage="setPage" />
        </v-layout>
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!hasError">
            <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2 hidden-sm-and-down" height="40px">
                <v-layout align-center justify-start row fill-height pr-2>
                    <v-flex :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'pr-3' : 'pr-5']" sm6 md7>
                        <h5>{{ $tc('tx.hash', 1) }}</h5>
                    </v-flex>
                    <v-flex sm2>
                        <h5>{{ $t('common.age') }}</h5>
                    </v-flex>
                    <v-flex sm2>
                        <h5 v-if="!isERC721">{{ $t('common.quantity') }}</h5>
                        <h5 v-else>{{ $t('common.id') }}</h5>
                    </v-flex>
                    <v-flex v-if="isERC721" sm2>
                        <h5>{{ $t('token.image') }}</h5>
                    </v-flex>
                </v-layout>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <div v-if="loading || hasError">
                <v-flex sm12>
                    <div
                        v-for="i in maxItems"
                        :key="i"
                        :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile mb-2' : '']"
                    >
                        <app-table-row-loading />
                    </div>
                </v-flex>
            </div>
            <div v-else>
                <v-card v-if="!hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
                </v-card>
                <v-card v-for="(transfer, index) in transfers" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row :transfer="transfer" :decimals="decimals" :symbol="symbol" :transfer-type="transferType" />
                </v-card>
                <!-- End Rows -->
                <v-layout
                    v-if="showPagination"
                    :justify-end="$vuetify.breakpoint.mdAndUp"
                    :justify-center="$vuetify.breakpoint.smAndDown"
                    row
                    class="pb-1 pr-2 pl-2"
                >
                    <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading || hasError" @newPage="setPage" />
                </v-layout>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import TransfersTableRow from './TokenTableTransfersRow.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import AppTableRowLoading from '@app/core/components/ui/AppTableRowLoading.vue'

const MAX_ITEMS = 10
const TYPES = ['ERC20', 'ERC721']

@Component({
    components: {
        AppTimeAgo,
        TransfersTableRow,
        AppPaginateHasMore,
        AppPaginate,
        AppTableRowLoading
    }
})
export default class TokenTableTransfers extends Vue {
    /*
        ===================================================================================
          Props
        ===================================================================================
        */
    @Prop(Array) transfers!: any[]
    @Prop(Boolean) hasItems!: boolean
    @Prop(Boolean) hasMore!: boolean
    @Prop(Boolean) showPagination!: boolean
    @Prop(Boolean) loading!: boolean
    @Prop(Number) decimals?: number
    @Prop(String) symbol?: string
    @Prop(Boolean) hasError!: boolean
    @Prop(Number) maxItems!: number
    @Prop(Number) index!: number
    @Prop(String) transferType!: string
    /*
    ===================================================================================
        Methods
    ===================================================================================
    */
    /**
     * Sets page number and reset value and emit
     * @param page {Number}
     * @param reset {Boolean}
     */
    setPage(page: number, reset: boolean = false): void {
        this.$emit('setPage', page, reset)
    }

    /*
    ===================================================================================
        Computed Values
    ===================================================================================
    */
    get isERC721() {
        return this.transferType === TYPES[1]
    }
}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
