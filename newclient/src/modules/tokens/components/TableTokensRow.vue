<template>
    <v-container pa-1>
        <v-layout>
            <!--
            =====================================================================================
              Mobile (XS-SM)
            =====================================================================================
            -->
            <v-flex xs12 hidden-md-and-up>
                <div class="token-mobile">
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pl-3 pr-3 pt-2 pb-2">
                        <!--
                        =====================================================================================
                          TOKEN IMAGE

                          Responsive Tally:
                          XS: 4/12 (2)
                        =====================================================================================
                        -->
                        <v-flex xs2 pl-1 pr-1 d-flex justify-center>
                            <div class="token-image-mobile">
                                <v-img :src="image" contain @error="onImageLoadFail" />
                            </div>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN NAME/PRICE/PRICE CHANGE/MARKET CAP

                          Responsive Tally:
                          XS: 10/12 (2)
                        =====================================================================================
                        -->
                        <v-flex xs8 pr-0 pt-2>
                            <v-layout row wrap align-center justify-start pl-2 pb-1>
                                <p class="black--text text-uppercase font-weight-medium mb-0 pr-1">{{ token.symbol }} -</p>
                                <p class="info--text caption mb-0 pr-1">{{ token.name }}</p>
                            </v-layout>
                            <v-layout row wrap align-end justify-start pa-2>
                                <p class="black--text text-truncate">
                                    {{ tokenPrice.value }}
                                    <app-tooltip v-if="tokenPrice.tooltipText" :text="tokenPrice.tooltipText" />
                                    <span :class="priceChangeClass">{{ percentageChange.value }}% </span>
                                </p>
                                <v-img v-if="priceChangeSymbol === '+'" :src="require('@/assets/up.png')" height="16px" max-width="16px" contain></v-img>
                                <v-img v-if="priceChangeSymbol === '-'" :src="require('@/assets/down.png')" height="16px" max-width="16px" contain></v-img>
                                <app-tooltip v-if="percentageChange.tooltip" :text="percentageChange.tooltip" />
                            </v-layout>
                            <v-layout row align-center justify-start pt-1>
                                <v-flex shrink pt-0 pb-0>
                                    <p class="info--text cap-text">{{ $t('token.market') }}</p>

                                    <p class="black--text pr-1">
                                        {{ tokenMarket.value }}
                                        <app-tooltip v-if="tokenMarket.tooltipText" :text="tokenMarket.tooltipText" />
                                    </p>
                                </v-flex>
                                <v-divider vertical />
                                <v-flex shrink pt-0 pb-0>
                                    <p class="info--text cap-text pl-1">{{ $t('token.volume') }}</p>
                                    <p class="black--text pl-1">
                                        {{ tokenVolume.value }}
                                        <app-tooltip v-if="tokenVolume.tooltipText" :text="tokenVolume.tooltipText" />
                                    </p>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN LINK BUTTON

                          Responsive Tally:
                          XS: 12/12 (2)
                        =====================================================================================
                        -->
                        <v-flex xs2>
                            <v-layout row align-center justify-space-around>
                                <div class="pb-1">
                                    <fav-handler-heart-actions :symbol="token.symbol" :address="token.contract" />
                                </div>
                                <v-btn :to="tokenLink" outline small fab color="bttnToken">
                                    <v-icon class="bttnToken--text token-btn-icon fas fa-chevron-right" small />
                                </v-btn>
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
                <v-card flat white>
                    <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-2">
                        <!--
                        =====================================================================================
                          TOKEN NAME/IMAGE

                          Responsive Tally:
                          MD: 3/12 (4)
                        =====================================================================================
                        -->
                        <v-flex md3>
                            <v-layout grid-list-xs row align-center justify-start fill-height>
                                <v-img :src="image" height="25px" max-width="25px" contain class="ml-3 mr-2" @error="onImageLoadFail" />
                                <router-link :to="tokenLink" class="info--text caption">
                                    <span v-if="token.symbol" class="black--text text-uppercase font-weight-medium"> {{ token.symbol }} - </span>
                                    {{ token.name }}
                                </router-link>
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN PRICE

                          Responsive Tally:
                          MD: 5/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2>
                            <p class="black--text text-truncate mb-0">
                                {{ tokenPrice.value }}
                                <app-tooltip v-if="tokenPrice.tooltipText" :text="tokenPrice.tooltipText" />
                            </p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN PRICE PERCENTAGE CHANGE

                          Responsive Tally:
                          MD: 7/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2>
                            <v-layout grid-list-xs row align-center justify-start>
                                <p :class="priceChangeClass">{{ percentageChange.value }}%</p>
                                <v-img v-if="priceChangeSymbol === '+'" :src="require('@/assets/up.png')" height="18px" max-width="18px" contain></v-img>
                                <v-img v-if="priceChangeSymbol === '-'" :src="require('@/assets/down.png')" height="18px" max-width="18px" contain></v-img>
                                <app-tooltip v-if="percentageChange.tooltip" :text="priceChange.tooltip" />
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN VOLUME

                          Responsive Tally:
                          MD: 9/12 (2)
                        =====================================================================================
                        -->
                        <v-flex md2>
                            <p class="black--text text-truncate mb-0">
                                {{ tokenVolume.value }}
                                <app-tooltip v-if="tokenVolume.tooltipText" :text="tokenVolume.tooltipText" />
                            </p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN MARKET CAP

                          Responsive Tally:
                          MD: 11/12 (2)
                        =====================================================================================
                        -->
                        <v-flex xs2>
                            <p class="black--text text-truncate mb-0">
                                {{ tokenMarket.value }}
                                <app-tooltip v-if="tokenMarket.tooltipText" :text="tokenMarket.tooltipText" />
                            </p>
                        </v-flex>
                        <!--
                        =====================================================================================
                          TOKEN FAVORITE

                          Responsive Tally:
                          MD: 12/12 (1)
                        =====================================================================================
                        -->
                        <v-flex xs1>
                            <fav-handler-heart-actions :symbol="token.symbol" :address="token.contract" />
                        </v-flex>
                    </v-layout>
                    <v-divider class="mb-2 mt-2" />
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import FavHandlerHeartActions from '@app/modules/favorite-tokens/handlers/FavHandlerHeartActions.vue'
import BN from 'bignumber.js'

@Component({
    components: { AppTooltip, FavHandlerHeartActions }
})
export default class TokenTableRow extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) token!: TokenMarketData

    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    imageExists = true

    /*
  ===================================================================================
    Computed
  ===================================================================================
  */
    get image(): string {
        if (this.token.image && this.imageExists) {
            return this.token.image
        }
        return '@/assets/icon-token.png'
    }

    get tokenLink(): string {
        return `/token/${this.token.contract}`
    }

    get tokenPrice(): FormattedNumber {
        const price = this.token.current_price || 0
        return this.formatUsdValue(new BN(price))
    }
    get percentageChange(): FormattedNumber {
        const change = this.token.price_change_percentage_24h || 0
        return this.formatPercentageValue(new BN(change))
    }

    get priceChangeSymbol(): string {
        const change = this.token.price_change_percentage_24h || 0
        if (change > 0) {
            return '+'
        }
        if (change < 0) {
            return '-'
        }
        return ''
    }
    get priceChangeClass(): string {
        const change = this.token.price_change_percentage_24h || 0

        if (change > 0) {
            return 'txSuccess--text pl-3'
        }
        if (change < 0) {
            return 'txFail--text pl-3'
        }
        return 'black--text pl-3'
    }

    get tokenVolume(): FormattedNumber {
        const volume = this.token.total_volume || 0
        return this.formatIntegerValue(new BN(volume))
    }

    get tokenMarket(): FormattedNumber {
        const marketCap = this.token.market_cap || 0
        return this.formatIntegerValue(new BN(marketCap))
    }

    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    onImageLoadFail(index): void {
        this.imageExists = false
    }
}
</script>

<style scoped lang="css">
.token-mobile {
    border: 1px solid #b4bfd2;
    padding: 10px 0px 10px 0px;
}

.v-btn--floating.v-btn--small {
    height: 30px;
    width: 30px;
    margin-right: 0px;
    margin-left: 0px;
}

.token-btn-icon {
    height: auto;
    width: auto;
}

.cap-text {
    font-size: 9px;
}
</style>
