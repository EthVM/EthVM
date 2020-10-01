<template>
    <v-container pa-0 ma-0>
        <component :is="isErc20 ? 'router-link' : 'span'" :to="tokenLink">
            <v-layout d-block>
                <!--
                =====================================================================================
                  Mobile (XS - SM)
                =====================================================================================
                -->
                <v-flex xs12 hidden-md-and-up>
                    <div class="table-row-mobile">
                        <v-layout grid-list-xs row align-center justify-center class="pt-3 pb-3 pr-2 pl-2">
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
                                        <v-img :src="image" contain />
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
                                    <v-flex v-if="isErc20" xs8 pa-1>
                                        <v-layout row align-center justify-start pa-2>
                                            <div class="black--text subtitle-2 font-weight-medium">
                                                <p v-if="name">{{ name }}</p>
                                                <p v-else-if="!name && symbolString" class="text-uppercase">{{ symbolString }}</p>
                                                <p v-else class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                                            </div>
                                            <app-transform-hash
                                                v-if="!name && !symbolString"
                                                :hash="token.tokenInfo.contract | toChecksum"
                                                :link="`/address/${token.tokenInfo.contract}`"
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
                                                :hash="token.tokenInfo.contract | toChecksum"
                                                :link="`/address/${token.tokenInfo.contract}`"
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
                                    <v-flex v-if="isErc20" xs4 pb-1 pt-1 pr-2>
                                        <v-layout v-if="priceChangeFormatted" grid-list-xs row justify-end>
                                            <p :class="priceChangeClass">{{ priceChangeFormatted.value }}%</p>
                                            <v-img v-if="change > 0" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                                            <v-img v-if="change < 0" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
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
                                            <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" pl-1 />
                                        </p>
                                        <p v-if="isErc20" class="info--text mb-2">
                                            {{ $t('usd.value') }}:
                                            <span class="black--text">
                                                {{ usdValueFormatted.value }}
                                                <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                                            </span>
                                            <span class="caption pl-2"> @ {{ currPrice.value }} {{ $t('token.per') }} {{ symbolString }} </span>
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
                            <v-layout grid-list-xs row align-center justify-start fill-height pl-2 pr-1>
                                <div class="token-image">
                                    <v-img :src="image" contain />
                                </div>
                                <div v-if="name || symbolString" class="black--text subtitle-2 font-weight-medium">
                                    <p v-if="name">{{ name }}</p>
                                    <p v-else class="text-uppercase">{{ symbolString }}</p>
                                </div>
                                <p v-else class="info--text contract-string mr-1">{{ $tc('contract.name', 1) }}:</p>
                                <app-transform-hash
                                    v-if="!name && !symbolString"
                                    :hash="token.tokenInfo.contract | toChecksum"
                                    :link="`/address/${token.tokenInfo.contract}`"
                                />
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
                                <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
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
                                    <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                                </p>
                                <p class="info--text caption pt-1">(@ {{ currPrice.value }} {{ $t('token.per') }} {{ symbolString }})</p>
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
                            <v-layout v-if="priceChangeFormatted" grid-list-xs row align-center justify-start pl-2 pr-2>
                                <p :class="priceChangeClass">{{ priceChangeFormatted.value }}%</p>
                                <v-img v-if="change > 0" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                                <v-img v-if="change < 0" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
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
        </component>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { ObjectCache } from 'apollo-cache-inmemory'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { getOwnersERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC20Tokens'
import { getOwnersERC721Balances_getOwnersERC721Balances as ERC721TokenType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getOwnersERC721Balances'
import { getNFTcontractsMeta_getNFTcontractsMeta_tokenContracts_primary_asset_contracts as NFTMetaType } from '@app/modules/address/handlers/AddressTokens/apolloTypes/getNFTcontractsMeta'
import BN from 'bignumber.js'

@Component({
    components: {
        AppTooltip,
        AppTransformHash
    }
})
export default class TableAddressTokensRow extends Mixins(NumberFormatMixin) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(Object) token!: ERC20TokenType | ERC721TokenType
    @Prop(String) holder!: string
    @Prop(Boolean) isErc20!: boolean
    @Prop(Object) tokenPriceInfo!: TokenMarketData | undefined
    @Prop(Object) nftMeta!: NFTMetaType | undefined

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get image(): string {
        if (this.isErc20 && this.tokenPriceInfo && this.tokenPriceInfo.image) {
            return this.tokenPriceInfo.image
        }
        if (!this.isErc20 && this.nftMeta && this.nftMeta.image_url) {
            return this.nftMeta.image_url
        }
        return require('@/assets/icon-token.png')
    }

    get balance(): FormattedNumber | string {
        if (this.isErc20) {
            return this.formatFloatingPointValue(this.getValue())
        }
        return this.formatNumber(new BN(this.token.balance).toNumber())
    }

    // get symbolString(): string {
    //     return this.token.tokenInfo.symbol ? this.token.tokenInfo.symbol : `${this.$tc('token.name', 2)}`
    // }

    get tokenLink(): string {
        return `/token/${this.token.tokenInfo.contract}?holder=${this.holder}`
    }

    get currPrice(): FormattedNumber {
        return this.tokenPriceInfo && this.tokenPriceInfo.current_price
            ? this.formatUsdValue(new BN(this.tokenPriceInfo.current_price))
            : this.formatUsdValue(new BN(0))
    }

    get usdValueFormatted(): FormattedNumber {
        if (this.isErc20 && this.tokenPriceInfo && this.tokenPriceInfo.current_price) {
            return this.formatUsdValue(new BN(this.tokenPriceInfo.current_price).multipliedBy(this.getValue()))
        }
        return this.formatUsdValue(new BN(0))
    }

    get change(): number {
        if (!this.tokenPriceInfo || !this.tokenPriceInfo.price_change_24h || this.tokenPriceInfo.price_change_24h === 0) {
            return 0
        } else if (this.tokenPriceInfo.price_change_24h > 0) {
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
        return this.tokenPriceInfo && this.tokenPriceInfo.price_change_24h ? this.formatPercentageValue(new BN(this.tokenPriceInfo.price_change_24h)) : null
    }

    get name(): string | undefined {
        if (this.token.tokenInfo.name === null || this.token.tokenInfo.name === 'UNKNOWN') {
            if (!this.isErc20 && this.nftMeta && this.nftMeta.name) {
                return this.nftMeta.name
            }
            if (this.isErc20 && this.tokenPriceInfo && this.tokenPriceInfo.name) {
                return this.tokenPriceInfo.name
            }
            return undefined
        }
        return this.token.tokenInfo.name
    }

    get symbolString(): string | undefined {
        if (this.token.tokenInfo.symbol === null || this.token.tokenInfo.symbol === 'UNKN') {
            if (!this.isErc20 && this.nftMeta && this.nftMeta.symbol) {
                return this.nftMeta.symbol
            }
            if (this.isErc20 && this.tokenPriceInfo && this.tokenPriceInfo.symbol) {
                return this.tokenPriceInfo.symbol
            }
            return undefined
        }
        return this.token.tokenInfo.symbol
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    getValue(): BN {
        if (this.isErc20) {
            let n = new BN(this.token.balance)
            if ('decimals' in this.token.tokenInfo && this.token.tokenInfo.decimals) {
                n = n.div(new BN(10).pow(this.token.tokenInfo.decimals))
            }
            return n
        }
        return new BN(this.token.balance)
    }

    showNft(): void {
        this.$emit('showNft', this.token.tokenInfo.contract, this.token.tokenInfo.name)
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
