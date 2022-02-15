<template>
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
                    <v-flex xs2 sm1 pl-1 pr-1 justify-center>
                        <div class="token-image-mobile">
                            <v-img :src="image" contain @error="onImageLoadFail" />
                        </div>
                    </v-flex>
                    <!--
                        =====================================================================================
                          TOKEN Name

                          Responsive Tally:
                          XS: 4/12 (2)
                        =====================================================================================
                        -->
                    <v-flex xs8 sm9>
                        <router-link v-if="token.symbol || token.name" :to="tokenLink">
                            <v-layout row wrap align-center justify-start pl-2>
                                <p class="black--text text-uppercase font-weight-medium mb-0 pr-1">{{ token.symbol }} -</p>
                                <p class="info--text caption mb-0 pr-1">{{ token.name }}</p>
                            </v-layout>
                        </router-link>
                        <v-layout v-else row align-center pa-2>
                            <p class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                            <app-transform-hash :hash="token.contract | toChecksum" :link="tokenLink" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs2>
                        <v-layout row align-center justify-end>
                            <fav-handler-heart-actions :symbol="token.symbol" :address="token.contract" :is-small="true" />
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout row wrap align-start justify-start pt-1 px-2>
                            <!--
                                =====================================================================================
                                  PRICE

                                  Responsive Tally:
                                  XS: 6/12 (2)
                                =====================================================================================
                                -->
                            <v-flex xs6 sm3 pa-1 mb-1>
                                <v-layout row align-start justify-start py-1>
                                    <v-divider vertical class="mobile-divider" />
                                    <v-flex>
                                        <p class="info--text cap-text mb-1">{{ $tc('price.name', 1) }}</p>
                                        <p class="black--text pr-1">
                                            {{ tokenPrice.value }}
                                            <app-tooltip v-if="tokenPrice.tooltipText" :text="tokenPrice.tooltipText" />
                                        </p>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <!--
                                =====================================================================================
                                 Change

                                  Responsive Tally:
                                  XS: 6/12 (2)
                                =====================================================================================
                                -->
                            <v-flex xs6 sm3 pa-1 mb-1>
                                <v-layout row align-start justify-start py-1>
                                    <v-divider vertical class="mobile-divider" />
                                    <v-flex>
                                        <p class="info--text cap-text mb-1">{{ $t('token.change') }}</p>
                                        <v-layout row align-center justify-start>
                                            <p :class="priceChangeClass">{{ percentageChange.value }}%</p>
                                            <v-img
                                                v-if="priceChangeSymbol === '+'"
                                                :src="require('@/assets/up.png')"
                                                height="16px"
                                                max-width="16px"
                                                contain
                                            ></v-img>
                                            <v-img
                                                v-if="priceChangeSymbol === '-'"
                                                :src="require('@/assets/down.png')"
                                                height="16px"
                                                max-width="16px"
                                                contain
                                            ></v-img>
                                            <app-tooltip v-if="percentageChange.tooltip" :text="percentageChange.tooltip" />
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <!--
                                =====================================================================================
                                 Market Cap

                                  Responsive Tally:
                                  XS: 6/12 (2)
                                =====================================================================================
                                -->
                            <v-flex xs6 sm3 pa-1 mb-1>
                                <v-layout row align-start justify-start py-1>
                                    <v-divider vertical class="mobile-divider" />
                                    <v-flex>
                                        <p class="info--text cap-text mb-1">{{ $t('token.market') }}</p>
                                        <p class="black--text pr-1">
                                            {{ tokenMarket.value }}
                                            <app-tooltip v-if="tokenMarket.tooltipText" :text="tokenMarket.tooltipText" />
                                        </p>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                            <!--
                                =====================================================================================
                                Volume

                                  Responsive Tally:
                                  XS: 6/12 (2)
                                =====================================================================================
                                -->
                            <v-flex xs6 sm3 pa-1 mb-1>
                                <v-layout row align-start justify-start class="mobile-divider" py-1>
                                    <v-divider vertical />
                                    <v-flex>
                                        <p class="info--text cap-text mb-1">{{ $t('token.volume') }}</p>
                                        <p class="black--text pr-1">
                                            {{ tokenVolume.value }}
                                            <app-tooltip v-if="tokenVolume.tooltipText" :text="tokenVolume.tooltipText" />
                                        </p>
                                    </v-flex>
                                </v-layout>
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
            <v-card flat white>
                <v-layout grid-list-xs row wrap align-center justify-start fill-height class="pt-2">
                    <!--
                        =====================================================================================
                          TOKEN NAME/IMAGE

                          Responsive Tally:
                          MD: 4/12 (4)
                        =====================================================================================
                        -->
                    <v-flex md4>
                        <v-layout grid-list-xs row align-center justify-start fill-height px-3>
                            <div class="token-image-block mr-4">
                                <v-img :src="image" height="25px" max-width="25px" contain @error="onImageLoadFail" />
                            </div>
                            <router-link v-if="token.symbol || token.name" :to="tokenLink" class="info--text caption">
                                <span v-if="token.symbol" class="black--text text-uppercase font-weight-medium"> {{ token.symbol }} - </span>
                                {{ token.name }}
                            </router-link>
                            <p v-else class="info--text mr-1">{{ $tc('contract.name', 1) }}:</p>
                            <div v-if="!token.symbol && !token.name" class="transform-contract">
                                <app-transform-hash :hash="token.contract | toChecksum" :link="tokenLink" class="pt-1" />
                            </div>
                        </v-layout>
                    </v-flex>
                    <!--
                        =====================================================================================
                          TOKEN PRICE

                          Responsive Tally:
                          MD: 6/12 (2)
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
                          MD: 8/12 (2)
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
                          MD: 10/12 (2)
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
                          TOKEN MARKET CAP AND HEART BUTTON

                          Responsive Tally:
                          MD: 12/12 (2)
                        =====================================================================================
                        -->
                    <v-flex xs2>
                        <v-layout grid-list-xs row align-center justify-space-between fill-height pr-2>
                            <p class="black--text text-truncate mb-0">
                                {{ tokenMarket.value }}
                                <app-tooltip v-if="tokenMarket.tooltipText" :text="tokenMarket.tooltipText" />
                            </p>
                            <fav-handler-heart-actions :symbol="token.symbol" :address="token.contract" :is-small="true" />
                        </v-layout>
                    </v-flex>
                </v-layout>
                <v-divider class="mb-2 mt-2" />
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import FavHandlerHeartActions from '@app/modules/favorite-tokens/handlers/FavHandlerHeartActions.vue'
import BN from 'bignumber.js'

@Component({
    components: { AppTooltip, FavHandlerHeartActions, AppTransformHash }
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
    get image(): string | false {
        if (this.token.image && this.imageExists && this.token.image !== '') {
            return this.token.image
        }
        return require('@/assets/icon-token.png')
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
            return 'txSuccess--text pl-2'
        }
        if (change < 0) {
            return 'txFail--text pl-2'
        }
        return 'black--text pl-2'
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
.mobile-divider {
    height: 50px;
}
.transform-contract {
    width: 50%;
}
.token-image-block {
    min-width: 25px;
}
</style>
