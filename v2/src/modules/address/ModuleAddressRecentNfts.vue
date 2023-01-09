<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6 h-100" z>
        <v-card-title class="card-title d-flex justify-space-between align-center mb-5 pa-0">
            <span class="text-h6 font-weight-bold">NFT Collection</span>

            <app-btn v-if="!xs" text="More" isSmall icon="east" @click="goToNftsPage"></app-btn>
            <app-btn-icon v-else icon="more_horiz" @click="goToNftsPage"></app-btn-icon>
        </v-card-title>
        <div>
            <template v-if="loadingBalance !== false">
                <div v-for="item in 9" :key="item" class="my-2">
                    <div class="skeleton-box rounded-xl mt-1 my-4" style="height: 24px"></div>
                </div>
            </template>
            <template v-else>
                <template v-if="!tokens || tokens.length < 1">
                    <app-no-result text="This address does not have any NFTs" class="mt-4 mt-sm-6"></app-no-result>
                </template>
                <template v-else>
                    <v-row :dense="xs">
                        <v-col v-for="(token, index) in tokens" :key="index" cols="6" sm="4">
                            <token-nft-img
                                :loading="loadingMeta"
                                :nft="token"
                                height="154"
                                class="border-radius-nft"
                                :index="index"
                                :tokens="tokens"
                            ></token-nft-img>
                        </v-col>
                    </v-row>
                    <!-- <div v-for="(transfer, index) in transfers" :key="`${transfer.transfer.transactionHash} - ${index}`" class="position-relative">
                        <nft-transfers-table-row :transfer="transfer" :is-overview="props.isOverview" :address-hash="props.addressHash" />
                    </div> -->
                </template>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, reactive, toRefs, ref, watch } from 'vue'
import AppNewUpdate from '@core/components/AppNewUpdate.vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { MarketDataFragment as TokenMarketData } from '@core/composables/CoinData/getLatestPrices.generated'
import { useCoinData } from '@core/composables/CoinData/coinData.composable'
import { TOKEN_FILTER_VALUES } from '@module/address/models/TokenSort'
import { useDisplay } from 'vuetify'
import { useGetOwnersNftTokensQuery } from './apollo/AddressTokens/tokens.generated'
import { useGetNftTokensMetaQuery, NftMetaFragment } from '@module/tokens/apollo/NFTMeta/nftMeta.generated'

import { AddressEventType } from '@/apollo/types'
import { useAddressToken } from '@core/composables/AddressTokens/addressTokens.composable'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import { useAppTableRowRender } from '@core/composables/AppTableRowRender/useAppTableRowRender.composable'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TokenNftImg from '../tokens/components/TokenNFT/TokenNftImg.vue'
import { NFTDetails } from '../tokens/components/TokenNFT/propModel'
import configs from '@/configs'
import Web3Utils from 'web3-utils'

const { xs } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    }
})

// const emit = defineEmits<{
//     (e: 'resetCount', eventType: AddressEventType, isReset: boolean): void
// }>()

// interface ComponentState {
//     nftMeta: Map<string, NftMetaFragment>
// }

// const state: ComponentState = reactive({
//     nftMeta: new Map()
// })

// const { addressHash } = toRefs(props)

// const { tokenBalanceValue, tokenCount, initialLoad: loadingAddressTokens } = useAddressToken(addressHash)
// const { loading: loadingMarketInfo } = useCoinData()

const {
    result: resultBalance,
    refetch,
    loading: loadingBalance
} = useGetOwnersNftTokensQuery(
    () => ({
        address: props.addressHash
    }),
    { notifyOnNetworkStatusChange: true }
)

const tokenIDS = computed<string>(() => {
    if (!loadingBalance.value && resultBalance.value) {
        let ids = ''
        resultBalance.value?.getOwnersNFTTokens.tokens.forEach(i => {
            const id = Web3Utils.hexToNumberString(i.tokenInfo.tokenId || '')
            ids = `${ids}ethereum.${i.tokenInfo.contract}.${id},`
        })
        return ids
    }
    return ''
})

const { result: metaResult, loading: loadingMeta } = useGetNftTokensMetaQuery(
    () => ({
        input: tokenIDS.value
    }),
    () => ({
        clientId: 'nftClient',
        enabled: tokenIDS.value !== ''
    })
)

const nftMeta = computed<Map<string, NftMetaFragment>>(() => {
    if (!loadingBalance.value && !loadingMeta.value && metaResult.value && metaResult.value.getNFTTokensMeta) {
        const map = new Map<string, NftMetaFragment>()
        metaResult.value.getNFTTokensMeta.nfts?.forEach(i => {
            if (i.token_id) {
                map.set(i.token_id, i)
            }
        })
        return map
    }
    return new Map()
})

const tokens = computed<NFTDetails[]>(() => {
    return resultBalance.value
        ? resultBalance.value?.getOwnersNFTTokens.tokens.map(token => {
              return {
                  type: token.type,
                  contract: token.tokenInfo.contract,
                  id: Web3Utils.hexToNumberString(token.tokenInfo.tokenId || ''),
                  meta: nftMeta.value.get(Web3Utils.hexToNumberString(token.tokenInfo.tokenId || ''))
              }
          })
        : []
})

// const getImage = (contract: string, tokenId: string | undefined | null): string => {
//     if (!tokenId) {
//         return require('@/assets/icon-token.png')
//     }
//     // const id = Web3Utils.hexToNumberString(i.tokenInfo.tokenId || '')
//     console.log()

//     const tknImage = `${configs.OPENSEA}/getImage?contract=${contract}&tokenId=${tokenId}`
//     return tknImage ? tknImage : require('@/assets/icon-token.png')
// }

/**
 * Render State Tracking
 */

// const transfersLength = computed<number>(() => {
//     return transferHistory.value.length
// })

// const { renderState } = useAppTableRowRender(transfersLength.value)

// const transfers = computed<Array<Transfer | null>>(() => {
// if (transferHistory.value.length > 0) {
//     const start = OVERVIEW_MAX_ITEMS * state.index
//     const end = start + OVERVIEW_MAX_ITEMS > transferHistory.value?.length ? transferHistory.value?.length : start + OVERVIEW_MAX_ITEMS
//     // If on mobile screen and on overview page
//     if (mdAndDown.value && props.isOverview) {
//         return transferHistory.value.slice(start, MOBILE_MAX_ITEMS)
//     }
//     if (props.isOverview) {
//         return transferHistory.value.slice(start, end)
//     }
//     return renderState.isActive ? transferHistory.value.slice(0, renderState.maxItems) : transferHistory.value
// }
//     return []
// })

/*
 * Initial load will be true only when the data is being loaded initially
 */
// const initialLoad = computed<boolean>(() => {
//     return !result.value
// })

// const setPage = (page: number, reset = false) => {
//     if (reset) {
//         refetch()
//         emit('resetCount', AddressEventType.NewErc721Transfer, true)
//     } else {
//         if (page > state.index && hasMore.value) {
//             fetchMore({
//                 variables: {
//                     hash: props.addressHash,
//                     _limit: MAX_ITEMS,
//                     _nextKey: result.value?.getERC721Transfers?.nextKey
//                 },
//                 updateQuery: (prev, { fetchMoreResult }) => {
//                     return {
//                         getERC721Transfers: {
//                             nextKey: fetchMoreResult?.getERC721Transfers.nextKey,
//                             transfers: [...prev.getERC721Transfers.transfers, ...(fetchMoreResult?.getERC721Transfers.transfers || [])],
//                             __typename: fetchMoreResult?.getERC721Transfers.__typename
//                         }
//                     }
//                 }
//             })
//         }
//     }
//     state.index = page
// }

const router = useRouter()
const goToNftsPage = async (): Promise<void> => {
    await router.push({
        name: ROUTE_NAME.ADDRESS_NFTS.NAME,
        query: { t: ADDRESS_ROUTE_QUERY.Q_NFTS[0] }
    })
}
</script>

<style lang="scss" scoped>
.border-radius-nft {
    border-radius: 10px;
}
</style>
