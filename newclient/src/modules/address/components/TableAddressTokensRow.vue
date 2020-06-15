<template>
    <v-container pa-0 ma-0>
        <router-link :to="tokenLink">
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
                                    <v-flex xs9 pa-1>
                                        <div v-if="token.tokenInfo.name || token.tokenInfo.symbol" class="black--text subtitle-2 font-weight-medium">
                                            <p v-if="token.tokenInfo.name">{{ token.tokenInfo.name }}</p>
                                            <p v-else class="text-uppercase">{{ token.tokenInfo.symbol }}</p>
                                        </div>
                                    </v-flex>
                                    <!--
                                    =====================================================================================
                                      TOKEN PRICE CHANGE

                                      Responsive Tally:
                                      XS: 12/12 (3)
                                    =====================================================================================
                                    -->
                                    <v-flex v-if="isErc20" xs3 pb-1 pt-1 pr-2>
                                        <v-layout v-if="priceChangeFormatted" grid-list-xs row justify-end pr-3>
                                            <p :class="priceChangeClass">{{ priceChangeFormatted.value }}%</p>
                                            <v-img
                                                v-if="tokenPriceInfo.change > 0"
                                                :src="require('@/assets/up.png')"
                                                height="18px"
                                                max-width="18px"
                                                contain
                                            ></v-img>
                                            <v-img
                                                v-if="tokenPriceInfo.change < 0"
                                                :src="require('@/assets/down.png')"
                                                height="18px"
                                                max-width="18px"
                                                contain
                                            ></v-img>
                                            <app-tooltip v-if="priceChangeFormatted.tooltipText" :text="priceChangeFormatted.tooltipText" />
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
                                            <span class="black--text"> {{ balance.value }}</span>
                                            <span v-if="isErc20 && token.tokenInfo.symbol" class="info--text caption pl-1 pr-1">{{
                                                token.tokenInfo.symbol
                                            }}</span>
                                            <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" pl-1 />
                                        </p>
                                        <p v-if="isErc20 && tokenPriceInfo.price" class="info--text mb-2">
                                            {{ $t('usd.value') }}:
                                            <span class="black--text">
                                                {{ usdValueFormatted.value }}
                                                <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                                            </span>
                                        </p>
                                        <p class="caption info--text">
                                            (@ {{ currPrice.value }}<app-tooltip v-if="currPrice.tooltipText" :text="currPrice.tooltipText" />
                                            {{ $t('token.per') }} {{ symbolString }})
                                        </p>
                                    </v-flex>
                                </v-layout>
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
                                <div v-if="token.tokenInfo.name || token.tokenInfo.symbol" class="black--text subtitle-2 font-weight-medium">
                                    <p v-if="token.tokenInfo.name">{{ token.tokenInfo.name }}</p>
                                    <p v-else class="text-uppercase">{{ token.tokenInfo.symbol }}</p>
                                </div>
                                <v-layout v-else row align-center justift-start pa-1>
                                    <p class="info--text contract-string caption mr-1">{{ $tc('contract.name', 1) }}:</p>
                                    <app-transform-hash :hash="token.tokenInfo" :link="`/address/${token.tokenInfo.contract}`" />
                                </v-layout>
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN Balance / Token ID

                          Responsive Tally:
                          MD: 7/12 (3)
                        =====================================================================================
                        -->
                        <v-flex md3>
                            <p class="black--text">
                                {{ balance.value }}
                                <span v-if="isErc20 && token.tokenInfo.symbol" class="info--text caption pr-1">{{ token.tokenInfo.symbol }}</span>
                                <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                            </p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN USD VALUE

                          Responsive Tally:
                          MD: 10/12 (3)
                        =====================================================================================
                        -->
                        <v-flex v-if="isErc20" md3>
                            <v-layout v-if="tokenPriceInfo.price" column align-start fill-height pl-2>
                                <p class="black--text">
                                    {{ usdValueFormatted.value }}
                                    <app-tooltip v-if="usdValueFormatted.tooltipText" :text="usdValueFormatted.tooltipText" />
                                </p>
                                <p class="info--text caption pt-1">
                                    (@ {{ currPrice.value }}<app-tooltip v-if="currPrice.tooltipText" :text="currPrice.tooltipText" /> {{ $t('token.per') }}
                                    {{ symbolString }})
                                </p>
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
                                <v-img v-if="tokenPriceInfo.change > 0" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                                <v-img v-if="tokenPriceInfo.change < 0" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                                <app-tooltip v-if="priceChangeFormatted.tooltipText" :text="priceChangeFormatted.tooltipText" />
                            </v-layout>
                        </v-flex>
                        <v-spacer v-else />
                    </v-layout>
                    <v-divider />
                </v-flex>
            </v-layout>
        </router-link>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { ObjectCache } from 'apollo-cache-inmemory'
import { PriceInfo } from './props'
import { getERC20Tokens_getOwnersERC20Tokens_owners as ERC20TokenType } from '@app/modules/address/handlers/AddressTokens/getERC20Tokens.type'
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

    @Prop(Object) token!: ERC20TokenType
    @Prop(String) holder!: string
    @Prop(Boolean) isErc20!: boolean
    @Prop(Object) tokenPriceInfo!: PriceInfo

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */

    get image(): string {
        return require('@/assets/icon-token.png')
    }

    get balance(): FormattedNumber | string {
        if (this.isErc20) {
            return this.formatFloatingPointValue(this.getValue())
        }
        return this.formatNumber(new BN(this.token.balance).toNumber())
    }

    get symbolString(): string {
        return this.token.tokenInfo.symbol ? this.token.tokenInfo.symbol : `${this.$tc('token.name', 2)}`
    }

    get tokenLink(): string {
        return `/token/${this.token.tokenInfo.contract}?holder=${this.holder}`
    }

    get currPrice(): FormattedNumber | null {
        return this.tokenPriceInfo.price ? this.formatUsdValue(new BN(this.tokenPriceInfo.price)) : null
    }

    get usdValueFormatted(): FormattedNumber | string {
        if (this.isErc20 && this.tokenPriceInfo.price) {
            return this.formatUsdValue(new BN(this.tokenPriceInfo.price).multipliedBy(this.getValue()))
        }
        return ''
    }

    get priceChangeClass(): string {
        if (!this.tokenPriceInfo.change || this.tokenPriceInfo.change === 0) {
            return 'black--text'
        } else if (this.tokenPriceInfo.change > 0) {
            return 'txSuccess--text'
        }
        return 'txFail--text'
    }

    get priceChangeFormatted(): FormattedNumber | null {
        return this.tokenPriceInfo.change ? this.formatPercentageValue(new BN(this.tokenPriceInfo.change)) : null
    }

    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    getValue(): BN {
        let n = new BN(this.token.balance)
        if (this.token.tokenInfo.decimals) {
            n = n.div(new BN(10).pow(this.token.tokenInfo.decimals))
        }
        return n
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
