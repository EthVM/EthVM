<template>
    <div>
        <!--
    =====================================================================================
      TABLE HEADER FOR UNIQUE TOKENS
    =====================================================================================
    -->
        <v-layout align-center justify-start row fill-height>
            <v-btn flat color="primary" class="text-capitalize" @click="$emit('hideNFT')">
                <v-icon left small>fas fa-arrow-left</v-icon>{{ $t('btn.back') }}</v-btn
            >
            <v-card-title class="title font-weight-bold pl-1">{{ contractName }} </v-card-title>
            <v-spacer />
            <app-paginate
                v-if="showPagination"
                :total="totalPages"
                :current-page="index"
                :has-input="true"
                :has-first="true"
                :has-last="true"
                @newPage="setPage"
            />
        </v-layout>
        <v-layout v-if="!loading" align-center justify-start row wrap fill-height>
            <v-flex v-for="(token, i) in uniqueToken" :key="i" xs12 sm6 md4 lg3>
                <div class="token-container pa-3">
                    <v-img :src="require('@/assets/icon-token.png')" height="80px" max-width="80x" contain />
                    <p class="caption text-xs-center mt-3 text-truncate">ID: {{ getTokenID(token) }}</p>
                </div>
            </v-flex>
        </v-layout>
        <v-layout v-else align-center justify-start row wrap fill-height>
            <v-flex v-for="i in 4" :key="i" xs12 sm6 md4 lg3>
                <div class="token-container">
                    <v-layout align-center justify-start row wrap fill-height pr-4 pl-4 pt-1 pb-1>
                        <v-flex xs12 pb-0>
                            <v-progress-linear color="lineGrey" value="40" indeterminate height="80" />
                        </v-flex>
                        <v-flex xs12 pt-0>
                            <v-progress-linear color="lineGrey" value="40" indeterminate height="15" class="mt-1 mb1" />
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AppPaginate from '@app/core/components/ui/AppPaginate.vue'
import { getOwnersERC721Tokens_getOwnersERC721Tokens_tokens as ERC721TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Tokens'
import BN from 'bignumber.js'
const MAXTOKENS = 16
@Component({
    components: {
        AppPaginate
    }
})
export default class TableAddressUniqueNft extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */
    @Prop(String) contractName!: string
    @Prop(Array) tokens!: ERC721TokenType[]
    @Prop(Boolean) loading!: boolean

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    index = 0
    /*
    ===================================================================================
     Computed
    ===================================================================================
    */
    get uniqueToken(): ERC721TokenType[] {
        if (!this.loading) {
            const start = this.index * MAXTOKENS
            const end = start + MAXTOKENS > this.tokens.length ? this.tokens.length : start + MAXTOKENS
            return this.tokens.slice(start, end)
        }
        return []
    }

    get totalPages(): number {
        return this.loading ? 0 : Math.ceil(new BN(this.tokens.length).div(MAXTOKENS).toNumber())
    }
    get showPagination(): boolean {
        return this.totalPages > 1
    }
    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    setPage(page: number): void {
        this.index = page
    }
    getTokenID(token: ERC721TokenType): string {
        return new BN(token.token).toString()
    }
}
</script>
<style scoped lang="css">
.token-container {
    border: 1px solid #b4bfd2;
    border-radius: 5px;
}
</style>
