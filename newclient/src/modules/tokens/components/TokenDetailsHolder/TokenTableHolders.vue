<template>
    <v-card color="white" flat class="pr-2 pl-2 pt-3">
        <!-- Pagination -->
        <v-layout v-if="showPagination" row fill-height justify-end class="pb-1 pr-2 pl-2">
            <app-paginate-has-more :loading="loading" :has-more="hasMore" :current-page="index" @newPage="setPage" />
        </v-layout>
        <!-- End Pagination -->

        <!-- Table Header -->
        <div v-if="!hasError">
            <v-card color="info" flat class="white--text pl-3 pr-1 mt-2 mb-2 hidden-sm-and-down" height="40px">
                <v-layout align-center justify-start row fill-height pr-3>
                    <v-flex sm6>
                        <h5>{{ $tc('address.name', 1) }}</h5>
                    </v-flex>
                    <v-flex sm3 md4>
                        <h5>{{ isERC721 ? $t('common.id') : $t('common.quantity') }}</h5>
                    </v-flex>
                    <v-flex sm3 md2>
                        <h5>{{ isERC721 ? $t('token.image') : $t('common.percentage') }}</h5>
                    </v-flex>
                </v-layout>
            </v-card>
            <!-- End Table Header -->

            <!-- Start Rows -->
            <v-card v-if="loading || hasError" flat>
                <v-flex xs12>
                    <div v-for="i in maxItems" :key="i">
                        <app-table-row-loading />
                    </div>
                </v-flex>
            </v-card>
            <div v-else>
                <v-card v-if="!hasItems" flat>
                    <v-card-text class="text-xs-center secondary--text">{{ $t('message.token.no-holders') }}</v-card-text>
                </v-card>
                <div v-for="(holder, i) in holders" v-else :key="i">
                    <token-table-holders-row :holder="holder" :token-address="addressRef" :decimals="decimals" :holder-type="holderType" />
                </div>
            </div>
        </div>
        <!-- End Rows -->
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BN from 'bignumber.js'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import TokenTableHoldersRow from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHoldersRow.vue'
import AppPaginateHasMore from '@app/core/components/ui/AppPaginateHasMore.vue'
import AppTableRowLoading from '@app/core/components/ui/AppTableRowLoading.vue'
const TYPES = ['ERC20', 'ERC721']
const MAX_ITEMS = 10
@Component({
    components: {
        AppPaginateHasMore,
        AppPaginate,
        TokenTableHoldersRow,
        AppTableRowLoading
    }
})
export default class TokenTableHolders extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(Array) holders!: any[]
    @Prop(Boolean) hasItems!: boolean
    @Prop(Boolean) hasMore!: boolean
    @Prop(Boolean) showPagination!: boolean
    @Prop(Boolean) loading!: boolean
    @Prop(Number) decimals?: number
    @Prop(Boolean) hasError!: boolean
    @Prop(Number) maxItems!: number
    @Prop(Number) index!: number
    @Prop(String) addressRef!: string
    @Prop(String) holderType!: string

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get isERC721() {
        return this.holderType === TYPES[1]
    }
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
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
