<template>
    <div>
        <div v-if="!loading" class="token-container pa-3">
            <v-img :src="image" :placeholder="require('@/assets/icon-token.png')" :height="maxHeight" max-width="180x" contain @error="nftImageLoadFail" />
            <p class="caption text-xs-center mt-3 text-truncate">ID: {{ getTokenID(token) }}</p>
        </div>

        <div v-else class="token-container">
            <v-layout align-center justify-start row wrap fill-height pr-4 pl-4 pt-1 pb-1>
                <v-flex xs12 pb-0>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="80" />
                </v-flex>
                <v-flex xs12 pt-0>
                    <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="mt-1 mb1" />
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getOwnersERC721Tokens_getOwnersERC721Tokens_tokens as ERC721TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Tokens'
import configs from '@app/configs'
import BN from 'bignumber.js'

@Component
export default class UniqueNftRow extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop({ type: Object, default: undefined }) token!: ERC721TokenType | undefined
    @Prop(Boolean) loading!: boolean
    @Prop({ type: String, default: '' }) contractDefaultImage!: string
    @Prop(String) contract!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    imageExhists = true
    /*
    ===================================================================================
     Computed
    ===================================================================================
    */
    get image(): string {
        if (!this.loading && this.token && this.imageExhists) {
            return `${configs.OPENSEA}/dev/getImage?contract=${this.contract}&tokenId=${this.getTokenID(this.token).toString()}`
        }
        return this.contractDefaultImage === '' ? require('@/assets/icon-token.png') : this.contractDefaultImage
    }
    get maxHeight(): string {
        return this.imageExhists ? '180px' : '100px'
    }

    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    getTokenID(token: ERC721TokenType): string {
        return new BN(token.token).toString()
    }

    nftImageLoadFail(index): void {
        this.imageExhists = false
    }
}
</script>
<style scoped lang="css">
.token-container {
    border: 1px solid #b4bfd2;
    border-radius: 5px;
}
</style>
