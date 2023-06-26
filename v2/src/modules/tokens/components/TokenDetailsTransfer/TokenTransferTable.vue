<template>
    <v-card variant="flat" class="px-4 px-sm-6 pb-4 pb-sm-6">
        <!-- Table Header -->
        <div v-if="!props.hasError">
            <v-row align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
                <v-col sm="3" md="2"> {{ $t('common.hash') }} </v-col>
                <v-col sm="3" lg="2" class="d-none d-sm-block"> {{ $t('common.from') }} </v-col>
                <v-spacer v-if="lgAndUp" />
                <v-col sm="3" lg="2" class="d-none d-sm-block"> {{ $t('common.to') }} </v-col>
                <v-col :sm="isNFT ? '1' : '3'" :md="isNFT ? 1 : 2" :lg="isNFT ? 1 : 3">
                    <template v-if="!isNFT">{{ $t('common.amount') }}</template>
                    <template v-else>{{ $t('token.id') }}</template>
                </v-col>
                <v-col v-if="isNFT" sm="2"> {{ $t('token.image') }} </v-col>
                <v-col md="2" class="d-none d-lg-block"> {{ $t('common.timestamp') }} </v-col>
            </v-row>
            <v-divider class="my-0 mt-sm-4 mx-n4 mx-sm-n6" />
            <!-- End Table Header -->

            <!-- Start Rows -->
            <div v-if="props.loading" class="p-ten-top">
                <div v-for="item in props.maxItems" :key="item" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" :style="isNFT ? 'height: 40px' : 'height: 32px'"></div>
                </div>
            </div>
            <div v-else class="p-ten-top">
                <div v-if="!props.hasItems && !props.loading">
                    <app-no-result :text="$t('token.noTransfers')" class="mt-4 mt-sm-6"></app-no-result>
                </div>
                <div v-for="(transfer, index) in props.transfers" v-else :key="index" color="white" class="transparent" flat>
                    <transfers-table-row
                        :transfer="transfer"
                        :decimals="props.decimals"
                        :symbol="props.symbol"
                        :transfer-type="props.transferType"
                        :nft-meta="getRowMeta(transfer)"
                    />
                </div>
                <!-- End Rows -->
            </div>
            <template v-if="props.showPagination">
                <app-pagination :length="props.pages" :has-more="props.hasMore" @update:modelValue="loadMoreData" :current-page="props.currentPageNum" />
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPagination from '@core/components/AppPagination.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TransfersTableRow from './TokenTransferTableRow.vue'
import { useDisplay } from 'vuetify'
import { TransferType } from '@/apollo/types'
import { NftMetaFragment } from '@/core/composables/NftMeta/nftMeta.generated'
import {
    TokenTransferFragment,
    Erc721TransferFragment,
    Erc1155TokenTransferFragment
} from '@module/tokens/apollo/TokenDetailsTransfer/tokenTransfers.generated'
import { generateMapId } from '@/core/composables/NftMeta/helpers'

const { lgAndUp } = useDisplay()

interface PropType {
    transfers: TokenTransferFragment[] | Erc721TransferFragment[] | Erc1155TokenTransferFragment[]
    hasItems: boolean
    hasMore: boolean
    showPagination: boolean
    loading: boolean
    initialLoad: boolean
    decimals?: number
    symbol?: string
    hasError: boolean
    maxItems: number
    pages: number
    currentPageNum: number
    transferType: string
    nftMeta?: Map<string, NftMetaFragment>
    loadingMeta: boolean
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

const loadMoreData = (num: number): void => {
    setPage(num)
}

const isNFT = computed<boolean>(() => {
    return props.transferType !== TransferType.Erc20
})

const getRowMeta = (transfer: TokenTransferFragment | Erc721TransferFragment | Erc1155TokenTransferFragment): NftMetaFragment | undefined => {
    if (transfer.__typename === 'ERC1155Transfer' || transfer.__typename === 'ERC721Transfer') {
        return props.nftMeta?.get(generateMapId(transfer.contract, transfer.tokenId))
    }
    return undefined
}
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
