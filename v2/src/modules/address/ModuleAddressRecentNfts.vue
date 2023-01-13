<template>
    <v-card variant="elevated" elevation="1" rounded="xl" class="pa-4 pa-sm-6 h-100" z>
        <v-card-title class="card-title d-flex justify-space-between align-center mb-5 pa-0">
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
                </template>
            </template>
            <template v-else>
                <v-row :dense="xs">
                    <v-col v-for="item in 9" :key="item" cols="6" sm="4">
                        <div class="skeleton-box rounded-xl" style="height: 154px"></div>
                    </v-col>
                </v-row>
            </template>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppBtn from '@core/components/AppBtn.vue'
import AppBtnIcon from '@core/components/AppBtnIcon.vue'
import { useDisplay } from 'vuetify'
import { useGetOwnersNftTokensQuery } from './apollo/AddressTokens/tokens.generated'
import { useRouter } from 'vue-router'
import { ADDRESS_ROUTE_QUERY, ROUTE_NAME } from '@core/router/routesNames'
import AppNoResult from '@/core/components/AppNoResult.vue'
import TokenNftImg from '../tokens/components/TokenNFT/TokenNftImg.vue'
import { NFTDetails } from '../tokens/components/TokenNFT/propModel'
import { useGetNftsMeta } from '@core/composables/NftMeta/useGetNftsMeta.composable'
import { NftId, generateId, generateMapId } from '@/core/composables/NftMeta/helpers'

const { xs } = useDisplay()
const props = defineProps({
    addressHash: {
        type: String,
        required: true
    }
})

const { result: resultBalance, loading: loadingBalance } = useGetOwnersNftTokensQuery(
    () => ({
        address: props.addressHash
    }),
    { notifyOnNetworkStatusChange: true }
)

/**
 * Computed Property of token ids to be fetch meta
 */
const tokenIDS = computed<NftId[]>(() => {
    const _ids: NftId[] = []
    if (!loadingBalance.value && resultBalance.value) {
        resultBalance.value?.getOwnersNFTTokens.tokens.forEach(i => {
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
const tokens = computed<NFTDetails[]>(() => {
    return resultBalance.value
        ? resultBalance.value?.getOwnersNFTTokens.tokens.map(token => {
              return {
                  type: token.type,
                  contract: token.tokenInfo.contract,
                  id: generateId(token.tokenInfo.tokenId),
                  meta: nftMeta.value.get(generateMapId(token.tokenInfo.contract, token.tokenInfo.tokenId))
              }
          })
        : []
})

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