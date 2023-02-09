<template>
    <v-card variant="flat" class="pa-4 pa-sm-6">
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
        <div v-else-if="!props.initialLoad && !isNft" class="p-ten-top">
            <div v-if="props.loading">
                <div v-for="n in 10" :key="n" style="padding: 10px 0">
                    <div class="skeleton-box rounded-xl" style="height: 32px"></div>
                </div>
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
        </div>
        <!-- End Table Row ERC20 -->

        <!-- Table Row NFT -->
        <v-row v-else-if="!props.initialLoad && isNft" class="p-ten-top">
            <template v-if="!loading && tokensNft.length > 0">
                <v-col v-for="(holder, index) in tokensNft" :key="index" cols="6" sm="4" lg="2" class="p-ten-top">
                    <token-nft-img v-if="!loading" :loading="loadingMeta" :nft="holder" height="240" class="rounded-md"></token-nft-img>
                    <div v-if="!loading" class="d-flex align-center">
                        <app-address-blockie :address="holder.holder || ''" :size="8" class="mr-1 mr-sm-2" />
                        <div>
                            <p>Owned By</p>
                            <app-transform-hash is-blue is-short :hash="eth.toCheckSum(holder.holder || '')" :link="`/address/${holder.holder}`" />
                        </div>
                    </div>
                </v-col>
            </template>
            <template v-else>
                <v-col v-for="(holder, index) in props.maxItems" :key="index" cols="6" sm="4" lg="2" class="p-ten-top">
                    <div class="skeleton-box rounded-xl" style="height: 281px"></div>
                </v-col>
            </template>
        </v-row>
        <!--End Table Row NFT -->
        <template v-if="props.showPagination">
            <app-pagination :length="props.pages" :has-more="props.hasMore" @update:modelValue="loadMoreData" :current-page="props.currentPageNum" />
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppPagination from '@core/components/AppPagination.vue'
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
    pages: number
    currentPageNum: number
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

const loadMoreData = (num: number): void => {
    setPage(num)
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
