<template>
    <v-card variant="flat" class="pa-4 pa-sm-6">
        <!-- Pagination -->
        <!--        <v-row v-if="props.showPagination" justify="center" justify-md="end" row fill-height class="pb-1 pr-2 pl-2">-->
        <!--            <app-paginate-has-more :current-page="props.index" :has-more="props.hasMore" :loading="props.loading || props.hasError" @newPage="setPage" />-->
        <!--        </v-row>-->
        <!-- End Pagination -->
        <!-- Table Header ERC20 -->
        <div v-if="!props.initialLoad && !props.hasError && !isNft">
            <v-row align="center" justify="start" class="text-body-1 text-info d-none d-sm-flex">
                <v-col :md="!isNft ? 3 : 4"> Address </v-col>
                <v-col sm="3" lg="4">
                    {{ isNft ? 'ID' : 'Quantity' }}
                </v-col>
                <v-col v-if="!isNft" md="3"> USD Value </v-col>
                <v-col sm="3" lg="2">
                    {{ isNft ? 'Image' : 'Percentage' }}
                </v-col>
            </v-row>
            <v-divider class="my-0 mt-md-4 mx-n4 mx-sm-n6" />
        </div>
        <!-- End Table Header -->

        <!-- Initial Loading Block. Shown Once before erc20/Nft layout is laoded -->
        <template v-if="props.initialLoad">
            <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 600px"></div>
        </template>
        <!-- End Initial Loading Block -->

        <!-- No results Message -->
        <div v-else-if="!props.hasItems && !props.loading">
            <app-no-result text="There are no holders for this token" class="mt-4 mt-sm-6"></app-no-result>
        </div>
        <!--End No results Message -->

        <!-- Table Row ERC20 -->
        <div v-else-if="!props.initialLoad && tokensErc20.length > 0" class="p-ten-top">
            <div v-if="loading">
                <div v-for="n in 10" class="skeleton-box rounded-xl mt-1 my-4" style="height: 44px" :key="n"></div>
            </div>
            <div v-for="(holder, index) in tokensErc20" v-else :key="index">
                <holders-table-row
                    :holder="holder"
                    :token-address="props.address"
                    :decimals="props.decimals"
                    :holder-type="props.holderType"
                    :price="tokenPrice"
                />
            </div>
            <app-intersect v-if="props.hasMore" @intersect="loadMoreData">
                <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
            </app-intersect>
        </div>
        <!-- End Table Row ERC20 -->

        <!-- Table Row NFT -->
        <v-row v-else-if="!props.initialLoad && tokensNft.length > 0" class="p-ten-top">
            <v-col v-for="(holder, index) in tokensNft" :key="index" cols="6" sm="4" lg="2" class="p-ten-top">
                <token-nft-img v-if="!loading" :loading="loadingMeta" :nft="holder" height="240" class="rounded-md"></token-nft-img>
                <div v-if="!loading" class="d-flex align-center">
                    <app-address-blockie :address="holder.holder || ''" :size="8" class="mr-1 mr-sm-2" />
                    <div>
                        <p>Owned By</p>
                        <app-transform-hash is-blue is-short :hash="eth.toCheckSum(holder.holder || '')" :link="`/address/${holder.holder}`" />
                    </div>
                </div>
                <div v-else class="skeleton-box rounded-xl" style="height: 245px"></div>
            </v-col>
            <app-intersect v-if="props.hasMore" @intersect="loadMoreData">
                <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
            </app-intersect>
        </v-row>
        <!--End Table Row NFT -->
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import AppNoResult from '@/core/components/AppNoResult.vue'
import HoldersTableRow from './TokenHolderTableRow.vue'
import AppAddressBlockie from '@core/components/AppAddressBlockie.vue'
import AppTransformHash from '@core/components/AppTransformHash.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import {
    Erc721TokenOwnerDetailsFragment as Erc721Owner,
    Erc1155TokenOwnerDetailsFragment as Erc1155Owner
} from '@module/tokens/apollo/TokenDetailsHolder/tokenHolders.generated'
import { Erc20TokenOwnerDetailsFragment as Erc20Owner } from '@module/tokens/apollo/TokenDetails/tokenDetails.generated'
import BN from 'bignumber.js'
import { generateMapId, generateId } from '@/core/composables/NftMeta/helpers'
import { TransferType } from '@/apollo/types'
import { NftMetaFragment } from '@/core/composables/NftMeta/nftMeta.generated'
import TokenNftImg from '@module/tokens/components/TokenNFT/TokenNftImg.vue'
import { NFTDetails } from '@module/tokens/components/TokenNFT/propModel'
import { eth } from '@core/helper'

interface PropType {
    holders: Erc20Owner[] | Erc721Owner[] | Erc1155Owner[]
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
    holderType: TransferType
    tokenData: TokenMarketData | false
    nftMeta?: Map<string, NftMetaFragment>
    loadingMeta: boolean
}
const props = defineProps<PropType>()

const emit = defineEmits<{
    (e: 'setPage', pageNumber: number, isReset: boolean): void
}>()

// Get price of token
const tokenPrice = computed<BN>(() => {
    return props.tokenData ? new BN(props.tokenData.current_price || 0) : new BN(0)
})

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

const isNft = computed<boolean>(() => {
    return props.holderType !== TransferType.Erc20
})

/**
 * Computed Property that returns array of nft token details to be dispalyed with Meta data
 */
const tokensNft = computed<NFTDetails[]>(() => {
    if (props.nftMeta && isNft.value) {
        return props.holders.map(owner => {
            return {
                type: props.holderType,
                balance: owner.__typename === 'ERC1155TokenBalance' ? owner.balance : undefined,
                contract: owner.tokenInfo.contract,
                id: generateId(owner.tokenInfo.tokenId),
                meta: props.nftMeta?.get(generateMapId(owner.tokenInfo.contract, owner.tokenInfo.tokenId)),
                holder: owner.owner
            }
        })
    }
    return []
})

/**
 * Computed Property that returns array of erc20 tokens
 */
const tokensErc20 = computed<Erc20Owner[]>(() => {
    if (!isNft.value) {
        return props.holders as Erc20Owner[]
    }
    return []
})
</script>

<style scoped lang="css">
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
