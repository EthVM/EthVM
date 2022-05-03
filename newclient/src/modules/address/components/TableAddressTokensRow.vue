<template>
    <v-container pa-0 ma-0>
        <v-layout d-block>
            <!--
                =====================================================================================
                  Mobile (XS - SM)
                =====================================================================================
                -->
            <v-flex xs12 hidden-md-and-up>
                <div class="table-row-mobile">
                    <v-layout grid-list-xs row wrap align-center justify-center class="pt-3 pb-3 pr-2 pl-2">
                        <!--
                            =====================================================================================
                              TOKEN IMAGE

                              Responsive Tally:
                              XS: 2/12 (2)
                            =====================================================================================
                            -->
                        <v-flex xs2 pa-1>
                            <v-layout row align-center justify-center pa-2>
                                <div class="token-image-mobile">
                                    <v-img :src="image" contain @error="imgLoadFail" />
                                </div>
                            </v-layout>
                        </v-flex>
                        <!--
                            =====================================================================================
                              REMAINING TOKEN INFO

                              Responsive Tally:
                              XS: 12/12 (10)
                            =====================================================================================
                            -->
                        <v-flex xs10>
                            <v-layout row wrap align-center justify-start>
                                <!--
                                    =====================================================================================
                                      TOKEN NAME

                                      Responsive Tally:
                                      XS: 9/12 (9)
                                    =====================================================================================
                                    -->
                                <v-flex v-if="isErc20" xs7 sm8 pa-1>
                                    <v-layout row align-start justify-start pa-2>
                                        <router-link v-if="name" :to="tokenLink" class="black--text subtitle-2 font-weight-medium">{{ name }}</router-link>
                                        <router-link
                                            v-else-if="!name && symbolString"
                                            :to="tokenLink"
                                            class="text-uppercase black--text subtitle-2 font-weight-medium"
                                            >{{ symbolString }}</router-link
                                        >
                                        <p v-else class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>

                                        <app-transform-hash
                                            v-if="!name && !symbolString"
                                            :hash="token.contract | toChecksum"
                                            :link="`/address/${token.contract}`"
                                        />
                                    </v-layout>
                                </v-flex>
                                <v-flex v-else xs12 pa-1>
                                    <v-layout row align-center justify-start pa-2>
                                        <div class="black--text subtitle-2 font-weight-medium">
                                            <p v-if="name">{{ name }}</p>
                                            <p v-else-if="!name && symbolString" class="text-uppercase">{{ symbolString }}</p>
                                            <p v-else class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                                        </div>
                                        <app-transform-hash
                                            v-if="!name && !symbolString"
                                            :hash="token.contract | toChecksum"
                                            :link="`/token/${token.contract}`"
                                        />
                                    </v-layout>
                                </v-flex>
                                <!--
                                    =====================================================================================
                                      TOKEN PRICE CHANGE

                                      Responsive Tally:
                                      XS: 12/12 (3)
                                    =====================================================================================
                                    -->
                                <v-flex v-if="isErc20" xs5 sm4 pb-1 pt-1 pl-1>
                                    <v-layout row justify-end align-center>
                                        <p v-if="priceChangeFormatted" :class="priceChangeClass">{{ priceChangeFormatted.value }}%</p>
                                        <v-img
                                            v-if="priceChangeFormatted && change > 0"
                                            :src="require('@/assets/up.png')"
                                            height="18px"
                                            max-width="18px"
                                            contain
                                        ></v-img>
                                        <v-img
                                            v-if="priceChangeFormatted && change < 0"
                                            :src="require('@/assets/down.png')"
                                            height="18px"
                                            max-width="18px"
                                            contain
                                        ></v-img>
                                        <fav-handler-heart-actions :symbol="favTokenSymbol" :address="token.contract" :is-small="true" />
                                    </v-layout>
                                </v-flex>
                                <v-spacer v-else />
                                <!--
                                    =====================================================================================
                                      TOKEN BALANCE/USD VALUE

                                      Responsive Tally:
                                      XS: 12/12 (12)
                                    =====================================================================================
                                    -->
                                <v-flex xs12 pa-1>
                                    <p class="info--text mb-2">
                                        {{ $t('common.amount') }}:
                                        <span v-if="isErc20" class="black--text"> {{ balance.value }}</span>
                                        <span v-else class="black--text"> {{ balance }}</span>
                                        <span v-if="isErc20 && symbolString" class="info--text caption pl-1 pr-1">{{ symbolString }}</span>
                                        <span v-show="balance.tooltipText">
                                            <app-tooltip :text="balance.tooltipText" pl-1 />
                                        </span>
                                    </p>
                                    <p v-if="isErc20" class="info--text mb-2">
                                        {{ $t('usd.value') }}:
                                        <span class="black--text">
                                            {{ usdValueFormatted.value }}
                                            <span v-show="usdValueFormatted.tooltipText">
                                                <app-tooltip :text="usdValueFormatted.tooltipText" />
                                            </span>
                                        </span>
                                        <span class="caption pl-2"> @ {{ currPrice.value }} {{ usdCaption }} </span>
                                    </p>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <v-flex v-if="!isErc20" shrink>
                            <v-btn outline small fab color="bttnToken" @click="showNft()">
                                <v-icon class="bttnToken--text token-btn-icon fas fa-chevron-right" small />
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>
            <!--
                =====================================================================================
                  Desktop (MD and UP)
                =====================================================================================
                -->
            <v-flex hidden-sm-and-down>
                <v-layout grid-list-xs row wrap align-center justify-start fill-height pt-2 pb-2>
                    <!--
                        =====================================================================================
                          TOKEN NAME/IMAGE

                          Responsive Tally:
                          MD: 4/12 (4)
                        =====================================================================================
                        -->
                    <v-flex md4>
                        <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-3>
                            <div class="token-image">
                                <v-img :src="image" contain @error="imgLoadFail" />
                            </div>
                            <component :is="isErc20 ? 'router-link' : 'span'" v-if="name || symbolString" :to="tokenLink">
                                <div class="black--text subtitle-2 font-weight-medium">
                                    <p v-if="name">{{ name }}</p>
                                    <p v-else class="text-uppercase">{{ symbolString }}</p>
                                </div>
                            </component>
                            <p v-else class="info--text contract-string mr-1">{{ $tc('contract.name', 1) }}:</p>
                            <app-transform-hash v-if="!name && !symbolString" :hash="token.contract | toChecksum" :link="`/token/${token.contract}`" />
                        </v-layout>
                    </v-flex>
                    <!--
                        =====================================================================================
                          TOKEN Balance / Token ID

                          Responsive Tally:
                          MD: 7/12 (3)
                        =====================================================================================
                        -->
                    <v-flex v-if="!isErc20" md2 />
                    <v-flex md3>
                        <p v-if="isErc20" class="black--text">
                            {{ balance.value }}
                            <span v-if="isErc20 && symbolString" class="info--text caption pr-1">{{ symbolString }}</span>
                            <span v-show="balance.tooltipText">
                                <app-tooltip :text="balance.tooltipText" />
                            </span>
                        </p>
                        <p v-else class="black--text">{{ balance }}</p>
                    </v-flex>
                    <!--
                        =====================================================================================
                          TOKEN USD VALUE

                          Responsive Tally:
                          MD: 10/12 (3)
                        =====================================================================================
                        -->
                    <v-flex v-if="isErc20" md3>
                        <v-layout column align-start fill-height pl-2>
                            <p class="black--text">
                                {{ usdValueFormatted.value }}
                                <span v-show="usdValueFormatted.tooltipText">
                                    <app-tooltip :text="usdValueFormatted.tooltipText" />
                                </span>
                            </p>
                            <p class="info--text caption pt-1">(@ {{ currPrice.value }} {{ usdCaption }})</p>
                        </v-layout>
                    </v-flex>
                    <!--
                        =====================================================================================
                          TOKEN  Price Change

                          Responsive Tally:
                          MD: 12/12 (2)
                        =====================================================================================
                        -->
                    <v-flex v-if="isErc20" md2>
                        <v-layout grid-list-xs row align-center justify-start pl-2 pr-2>
                            <p v-if="priceChangeFormatted" :class="priceChangeClass">{{ priceChangeFormatted.value }}%</p>
                            <v-img v-if="priceChangeFormatted && change > 0" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                            <v-img v-if="priceChangeFormatted && change < 0" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                            <v-spacer />
                            <fav-handler-heart-actions :symbol="favTokenSymbol" :address="token.contract" :is-small="true" />
                        </v-layout>
                    </v-flex>
                    <v-spacer v-else />
                    <v-flex v-if="!isErc20" shrink>
                        <v-btn outline color="secondary" class="text-capitalize" @click="showNft()">{{ $t('btn.view-all') }}</v-btn>
                    </v-flex>
                </v-layout>
                <v-divider />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import FavHandlerHeartActions from '@app/modules/favorite-tokens/handlers/FavHandlerHeartActions.vue'
import { ObjectCache } from 'apollo-cache-inmemory'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Balances'
import { getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts as NFTMetaType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getNFTcontractsMeta'
import { Token } from '@app/modules/address/models/TokenSort'
import BN from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppTransformHash,
        FavHandlerHeartActions
    }
})
export default class TableAddressTokensRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) token!: Token
    @Prop(String) holder!: string

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */

    imageExists = true

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    get isErc20(): boolean {
        return this.token.isERC20
    }

    get image(): string {
        if (this.token.image && this.imageExists) {
            return this.token.image
        }
        return require('@/assets/icon-token.png')
    }

    get balance(): FormattedNumber | string {
        if (this.isErc20) {
            return this.formatFloatingPointValue(this.token.balance)
        }
        return this.formatNumber(new BN(this.token.balance).toNumber())
    }

    get tokenLink(): string {
        return `/token/${this.token.contract}?holder=${this.holder}`
    }

    get currPrice(): FormattedNumber {
        return this.token.current_price ? this.formatUsdValue(new BN(this.token.current_price)) : this.formatUsdValue(new BN(0))
    }

    get usdValueFormatted(): FormattedNumber {
        return this.formatUsdValue(this.token.usdValue)
    }

    get change(): number {
        if (!this.token.price_change_percentage_24h || this.token.price_change_percentage_24h === 0) {
            return 0
        } else if (this.token.price_change_percentage_24h > 0) {
            return 1
        }
        return -1
    }

    get priceChangeClass(): string {
        if (this.change === 0) {
            return 'black--text'
        } else if (this.change > 0) {
            return 'txSuccess--text'
        }
        return 'txFail--text'
    }

    get priceChangeFormatted(): FormattedNumber | null {
        return this.token.price_change_percentage_24h ? this.formatPercentageValue(new BN(this.token.price_change_percentage_24h)) : null
    }

    get name(): string | undefined {
        return this.token.name ? this.token.name : undefined
    }

    get symbolString(): string | undefined {
        return this.token.symbol ? this.token.symbol : undefined
    }

    get favTokenSymbol(): string {
        return this.symbolString && this.isErc20 ? this.symbolString : ''
    }

    get usdCaption(): string {
        return this.symbolString ? `${this.$t('token.per')} ${this.symbolString}` : `${this.$t('token.per')} ${this.$tc('token.name', 1)}`
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    /**
     * Emit showNft to parent
     */
    showNft(): void {
        this.$emit('showNft', this.token.contract, this.token.name)
    }
    /**
     * Image loading failed catcher
     */
    imgLoadFail(): void {
        this.imageExists = false
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}

p {
    margin-bottom: 0px;
    padding-bottom: 0px;
}
</style>
