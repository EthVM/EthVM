<template>
    <v-card
        :variant="!props.isOverview ? 'flat' : 'elevated'"
        :elevation="props.isOverview ? 1 : 0"
        rounded="xl"
        :class="[props.isOverview ? 'pt-4 pt-sm-6' : '', 'px-4 px-sm-6 pb-4 pb-sm-6 h-100']"
    >
        <v-card-title v-if="props.isOverview" class="card-title d-flex justify-space-between align-center mb-5 pa-0">
            <span class="text-h6 font-weight-bold">NFT Collection</span>
            <app-btn v-if="!xs" text="More" isSmall icon="east" @click="goToNftsPage"></app-btn>
            <app-btn-icon v-else icon="more_horiz" @click="goToNftsPage"></app-btn-icon>
        </v-card-title>
        <div>
            <template v-if="loadingBalance === false && loadingMeta === false">
                <template v-if="!tokens || tokens.length < 1">
                    <app-no-result text="This address does not have any NFTs" class="mt-4 mt-sm-6"></app-no-result>
                </template>
                <template v-else>
                    <v-row :dense="xs">
                        <v-col v-for="(token, index) in displayTokens" :key="index" cols="6" sm="4" :lg="props.isOverview ? '4' : '2'">
                            <token-nft-img
                                :loading="loadingMeta"
                                :nft="token"
                                height="154"
                                class="border-radius-nft"
                                :index="index"
                                :tokens="displayTokens"
                            ></token-nft-img>
                            <p v-if="!props.isOverview && token.meta && token.meta.name">{{ token.meta.name }}</p>
                            <p v-if="!props.isOverview && (!token.meta || !token.meta.name)">Unknown</p>
                        </v-col>
                    </v-row>
                </template>
            </template>
            <template v-else>
                <v-row :dense="xs">
                    <v-col v-for="item in 9" :key="item" cols="6" sm="4" :lg="props.isOverview ? '4' : '2'">
                        <div class="skeleton-box rounded-xl" style="height: 154px"></div>
                    </v-col>
                </v-row>
            </template>
            <template v-if="showPagination">
                <app-pagination :length="numberOfPages" :has-more="hasMore" @update:modelValue="loadMoreData" :current-page="pageNum" />
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import AppPagination from '@core/components/AppPagination.vue'
import { useDisplay } from 'vuetify'
import { useGetOwnersNftTokensQuery } from './apollo/AddressTokens/tokens.generated'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TokenNftImg from '../tokens/components/TokenNFT/TokenNftImg.vue'
import { NFTDetails } from '../tokens/components/TokenNFT/propModel'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftId, generateId, generateMapId } from '@/core/composables/NftMeta/helpers'
import { AddressEventType, NftType } from '@/apollo/types'
import { ITEMS_PER_PAGE } from '@core/constants'
import { useAppPaginate } from '@core/composables/AppPaginate/useAppPaginate.composable'
const { xs } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    },
    isOverview: {
        type: Boolean
    }
})

/**------------------------
 * NFT Data
 -------------------------*/

const NFT_ITEMS_PER_PAGE = 48

const {
    result: resultBalance,
    loading: loadingBalance,
    fetchMore
} = useGetOwnersNftTokensQuery(
    () => ({
        address: props.addressHash,
        limit: props.isOverview ? 9 : NFT_ITEMS_PER_PAGE
    }),
    { notifyOnNetworkStatusChange: true }
)

/**
 * Computed Property that returns array of tokens to be dispalyed with Meta data
 */
const tokens = computed(() => {
    return resultBalance.value ? resultBalance.value?.getOwnersNFTTokens.tokens : []
})

const { numberOfPages, pageData: currentPageData, setPageNum, pageNum } = useAppPaginate(tokens, 'recentNfts', NFT_ITEMS_PER_PAGE)

/**
 * Computed Property of token ids to be fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (!loadingBalance.value && resultBalance.value) {
        currentPageData.value.forEach(i => {
            const id = {
                id: generateId(i.tokenInfo.tokenId),
                contract: i.tokenInfo.contract
            }
            _ids.push(id)
        })
    }
    return _ids
})
const { nftMeta, loadingMeta } = useGetNftsMeta(tokenIDS, loadingBalance)

/**
 * Computed Property that returns array of tokens to be dispalyed with Meta data
 */
const displayTokens = computed<NFTDetails[]>(() => {
    return resultBalance.value
        ? currentPageData.value.map(token => {
              return {
                  type: token.type,
                  balance: token.type === NftType.Erc1155 ? token.balance : undefined,
                  contract: token.tokenInfo.contract,
                  id: generateId(token.tokenInfo.tokenId),
                  meta: nftMeta.value.get(generateMapId(token.tokenInfo.contract, token.tokenInfo.tokenId))
              }
          })
        : []
})

const hasMore = computed<boolean>(() => {
    return !!resultBalance.value?.getOwnersNFTTokens.nextKey
})

const showPagination = computed<boolean>(() => {
    return !!tokens.value && tokens.value.length > 0 && !props.isOverview
})

const setPage = () => {
    if (pageNum.value > numberOfPages.value && hasMore.value) {
        fetchMore({
            variables: {
                address: props.addressHash,
                limit: NFT_ITEMS_PER_PAGE,
                nextKey: resultBalance.value?.getOwnersNFTTokens.nextKey
            },
            updateQuery: (prev, { fetchMoreResult }) => {
                return {
                    getOwnersNFTTokens: {
                        nextKey: fetchMoreResult?.getOwnersNFTTokens.nextKey,
                        tokens: [...prev.getOwnersNFTTokens.tokens, ...(fetchMoreResult?.getOwnersNFTTokens.tokens || [])],
                        __typename: fetchMoreResult?.getOwnersNFTTokens.__typename
                    }
                }
            }
        })
    }
}

const loadMoreData = (pageNum: number): void => {
    setPageNum(pageNum)
    setPage()
}

/**------------------------
 * Router
 -------------------------*/

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
