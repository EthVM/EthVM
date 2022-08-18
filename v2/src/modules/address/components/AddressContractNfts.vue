<template>
    <div class="nft-container">
        <app-expansion-panel v-if="!loading && tokens.tokens.length > 0" :title="props.name" class="pt-3" @expand="showMoreTokens">
            <template #visible-content>
                <v-row class="tokens-list">
                    <v-col cols="4" md="2" v-for="token in visibleTokens.slice(0, 6)" :key="token.token">
                        <div>
                            <v-img :src="getImage(token.token)" max-height="150" />
                            <p class="text-caption">{{ props.name }} #{{ getTokenId(token.token) }}</p>
                        </div>
                    </v-col>
                </v-row>
            </template>
            <template v-if="hasMore" #expand-content>
                <v-row class="tokens-list">
                    <v-col cols="4" md="2" v-for="token in visibleTokens.slice(6, state.end)" :key="token.token">
                        <div>
                            <v-img :src="getImage(token.token)" max-height="150" />
                            <p class="text-caption">{{ props.name }} #{{ getTokenId(token.token) }}</p>
                        </div>
                    </v-col>
                    <template v-if="visibleTokens.length > 6">
                        <app-intersect @intersect="onIntersect">
                            <v-row class="ma-0">
                                <v-col cols="4" md="2">
                                    <v-img :src="getImage()" height="150" />
                                </v-col>
                                <v-col cols="4" md="2">
                                    <v-img :src="getImage()" height="150" />
                                </v-col>
                                <v-col cols="4" md="2">
                                    <v-img :src="getImage()" height="150" />
                                </v-col>
                            </v-row>
                        </app-intersect>
                    </template>
                </v-row>
            </template>
        </app-expansion-panel>
        <template v-else>
            <v-row>
                <v-col cols="4" md="2">
                    <div>
                        <v-img :src="getImage()" max-height="150" />
                        <p class="text-caption">{{ props.name }}</p>
                    </div>
                </v-col>
            </v-row>
        </template>
        <v-divider class="my-3" />
    </div>
</template>

<script setup lang="ts">
import { OwnerErc721Fragment, TokenFragment, useGetOwnersErc721TokensQuery } from '../apollo/AddressTokens/tokens.generated'
import { computed, reactive } from 'vue'
import BigNumber from 'bignumber.js'
import AppExpansionPanel from '@core/components/AppExpansionPanel.vue'
import AppIntersect from '@core/components/AppIntersect.vue'
import configs from '@/configs'

const props = defineProps({
    contract: { type: String, required: true },
    addressHash: { type: String, required: true },
    name: { type: String, required: true }
})

const state = reactive({
    showMore: false,
    end: 6
})

const { result, loading } = useGetOwnersErc721TokensQuery(
    () => ({
        hash: props.addressHash,
        tokenContract: props.contract
    }),
    {
        enabled: () => !!props.contract
    }
)

const tokens = computed<OwnerErc721Fragment | undefined>(() => {
    return result.value?.getOwnersERC721Tokens
})

const visibleTokens = computed<TokenFragment[] | undefined>(() => {
    return tokens.value?.tokens.slice(0, state.end)
})

const hasMore = computed<boolean>(() => {
    return tokens.value?.tokens.length > 6
})

const showMoreTokens = () => {
    if (hasMore.value) {
        state.showMore = !state.showMore
        state.end = state.showMore ? 24 : 6
    }
}

const getTokenId = (token: string): string => {
    return new BigNumber(token).toString()
}

const getImage = (token: string): string => {
    if (!loading.value && token) {
        const tokenId = getTokenId(token)
        const tknImage = `${configs.OPENSEA}/getImage?contract=${props.contract}&tokenId=${tokenId.toString()}`
        return tknImage ? tknImage : require('@/assets/icon-token.png')
    }
    return require('@/assets/icon-token.png')
}
const onIntersect = (e: boolean): false => {
    if (e) {
        state.end += 24
    }
}
</script>

<style lang="scss" scoped>
.nft-container {
    //min-height: 250px;
    //max-height: 1000px;
    margin-bottom: 50px;

    .sticky-header {
        position: sticky;
        top: 100px;
    }

    .tokens-list {
        //max-height: 700px;
        //overflow-y: auto;

        /* width */
        //&::-webkit-scrollbar {
        //    width: 10px;
        //}
        //
        ///* Track */
        //&::-webkit-scrollbar-track {
        //    background: #f1f1f1;
        //    border-radius: 5px;
        //}
        //
        ///* Handle */
        //&::-webkit-scrollbar-thumb {
        //    background: rgba(#000, 0.2);
        //    border-radius: 5px;
        //    transition: background 0.2s ease-out;
        //
        //    /* Handle on hover */
        //    &:hover {
        //        background: rgba(#000, 0.3);
        //    }
        //}
    }
}
</style>
