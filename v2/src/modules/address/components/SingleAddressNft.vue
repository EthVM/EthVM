<template>
    <div>
        <template v-if="!loading && tokens.tokens.length > 0">
            <v-row>
                <v-col cols="4" md="2" v-for="token in tokens.tokens.slice(0, 6)" :key="token.token">
                    <div>
                        <v-img :src="getImage(token.token)" max-height="150" />
                        <p class="text-caption">{{ props.name }} #{{ getTokenId(token.token) }}</p>
                    </div>
                </v-col>
            </v-row>
        </template>
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
    </div>
</template>

<script setup lang="ts">
import { OwnerErc721Fragment, useGetOwnersErc721TokensQuery } from '../apollo/tokens.generated'
import { computed, reactive } from 'vue'
import BigNumber from 'bignumber.js'
import configs from '@/configs'

const props = defineProps({
    contract: { type: String, required: true },
    addressHash: { type: String, required: true },
    name: { type: String, required: true }
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
</script>
