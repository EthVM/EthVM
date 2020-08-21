<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
        <!-- LOADING / ERROR -->
        <v-flex v-if="loading" xs12>
            <v-progress-linear color="blue" indeterminate />
        </v-flex>
        <!-- Pagination -->
        <v-layout v-if="showPagination" row fill-height justify-end class="pb-1 pr-2 pl-2">
            <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading" @newPage="setPage" />
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
                        <h5>{{ $t('common.quantity') }}</h5>
                    </v-flex>
                </v-layout>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <div v-if="loading">
                <v-flex sm12>
                    <div
                        v-for="i in maxItems"
                        :key="i"
                        :class="[$vuetify.breakpoint.name === 'sm' || $vuetify.breakpoint.name === 'xs' ? 'table-row-mobile mb-2' : '']"
                    >
                        <transfers-table-row-loading />
                    </div>
                </v-flex>
            </div>
            <div v-else>
                <v-card v-if="!hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">{{ $t('transfer.empty') }}</v-card-text>
                </v-card>
                <v-card v-for="(transfer, index) in transfers" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row :transfer="transfer" :decimals="decimals" :symbol="symbol" />
                </v-card>
                <!-- End Rows -->
                <v-layout v-if="showPagination" justify-end row class="pb-1 pr-2 pl-2">
                    <app-paginate-has-more :current-page="index" :has-more="hasMore" :loading="loading" @newPage="setPage" />
                </v-layout>
            </div>
        </div>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppTimeAgo from '@app/core/components/ui/AppTimeAgo.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppError from '@app/core/components/ui/AppError.vue'
import TransfersTableRow from './TransfersTableRow.vue'
import TransfersTableRowLoading from './TransfersTableRowLoading.vue'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'

const MAX_ITEMS = 10

@Component({
    components: {
        AppTimeAgo,
        AppError,
        TransfersTableRow,
        TransfersTableRowLoading,
        AppPaginateHasMore,
        AppPaginate
    }
})
export default class TransfersTable extends Vue {
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
    @Prop(String) error?: string
    @Prop(Number) maxItems!: number
    @Prop(Number) index!: number
    /*
        ===================================================================================
          Methods
        ===================================================================================
        */

    setPage(page: number, reset: boolean = false): void {
        this.$emit('setPage', page, reset)
    }
    /*
        ===================================================================================
          Computed Values
        ===================================================================================
        */
    get hasError(): boolean {
        return !!this.error && this.error !== ''
    }
}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
