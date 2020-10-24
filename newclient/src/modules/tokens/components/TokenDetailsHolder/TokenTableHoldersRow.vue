<template>
    <v-container pa-0 ma-0>
        <v-layout d-block>
            <!--
        =====================================================================================
          Mobile (XS-SM)
        =====================================================================================
      -->
            <v-flex xs12 hidden-md-and-up>
                <div class="table-row-mobile">
                    <v-layout grid-list-xs row wrap align-center justify-center class="pa-3">
                        <v-flex v-if="isERC721" xs2 sm1>
                            <v-img :src="image" align-center justify-start max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                        </v-flex>
                        <v-flex :xs10="isERC721" :sm11="isERC721">
                            <v-flex xs12>
                                <v-layout row align-center justify-start pa-2>
                                    <p class="info--text pr-2">{{ $tc('token.holder', 1) }}:</p>
                                    <app-transform-hash :hash="holder.owner | toChecksum" :link="holderLink" />
                                </v-layout>
                            </v-flex>
                            <v-flex xs12>
                                <v-layout row align-center justify-start pa-2>
                                    <p class="info--text pr-2">{{ isERC721 ? $t('common.id') : $t('common.quantity') }}:</p>
                                    <p>
                                        {{ isERC721 ? getTokenID : balance.value }}
                                        <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                                    </p>
                                </v-layout>
                            </v-flex>
                            <v-flex v-if="!isERC721" xs12>
                                <v-layout row align-center justify-start pa-2>
                                    <p class="info--text pr-2">{{ $t('common.percentage') }}:</p>
                                    <p>
                                        {{ share.value }}%
                                        <app-tooltip v-if="share.tooltipText" :text="share.tooltipText" />
                                    </p>
                                </v-layout>
                            </v-flex>
                        </v-flex>
                    </v-layout>
                </div>
            </v-flex>
            <!--
        =====================================================================================
          Desktop (SM-LG)
        =====================================================================================
      -->
            <v-flex hidden-sm-and-down>
                <v-layout align-center justify-start row fill-height pa-3>
                    <!-- Column 1: Holders Address -->
                    <v-flex sm6 pr-4>
                        <app-transform-hash :hash="holder.owner | toChecksum" :link="holderLink" />
                    </v-flex>
                    <!-- End Column 1 -->

                    <!-- Column 2: Balance -->
                    <v-flex sm1md4>
                        <p class="mb-0 ml-2">
                            {{ isERC721 ? getTokenID : balance.value }}
                            <app-tooltip v-if="balance.tooltipText" :text="balance.tooltipText" />
                        </p>
                    </v-flex>
                    <!-- End Column 2 -->

                    <!-- Column 3: Share (ERC20)-->
                    <v-flex v-if="!isERC721" sm3 md2>
                        <p class="mb-0 ml-2">
                            {{ share.value }}%
                            <app-tooltip v-if="share.tooltipText && !isERC721" :text="share.tooltipText" />
                        </p>
                    </v-flex>
                    <!-- End Column 3 -->

                    <!-- Column 3: Token Image (ERC721) -->
                    <v-flex v-if="isERC721" sm3 md2>
                        <v-img :src="image" align-center justify-start max-height="50px" max-width="50px" contain @error="onImageLoadFail" />
                    </v-flex>
                    <!-- End Column 3 -->
                </v-layout>
                <v-divider />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import AppTransformHash from '@app/core/components/ui/AppTransformHash.vue'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/ERC20TokenOwnerDetails.ts'
import BN from 'bignumber.js'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import AppTooltip from '@app/core/components/ui/AppTooltip.vue'
import BigNumber from 'bignumber.js'
import configs from '@app/configs'
const TYPES = ['ERC20', 'ERC721']

@Component({
    components: {
        AppTooltip,
        AppTransformHash
    }
})
export default class TokenTableHoldersRow extends Mixins(NumberFormatMixin) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(Object) holder!: TokenOwnerInfo
    @Prop(String) tokenAddress!: string
    @Prop(Number) decimals?: number
    @Prop(String) holderType!: string

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
        if (this.holder && this.imageExists) {
            return `${configs.OPENSEA}/getImage?contract=${this.holder.tokenInfo.contract}&tokenId=${this.getTokenID}`
        }
        return require('@/assets/icon-token.png')
    }

    /**
     * Format url to token details -> holder view
     *
     * @param  {Object} holder - Holder object
     * @return {String}        [description]
     */
    get holderLink(): string {
        return `/address/${this.holder.owner}`
    }

    /**
     * Calculate percentage share of totalSupply held by this holder
     * @return {FormattedNumber} - Share
     */
    get share(): FormattedNumber {
        if (!(this.holder.tokenInfo.totalSupply && this.holder.balance)) {
            return { value: 'N/A' }
        }
        BigNumber.config({ DECIMAL_PLACES: 50 })
        const share = new BigNumber(this.holder.balance).times(100).dividedBy(this.holder.tokenInfo.totalSupply)
        return this.formatPercentageValue(share)
    }

    /**
     * Calculate and format balance held by given holder
     * @param  {Object} holder - Holder object
     * @return {Object} - FormattedNumber
     */
    get balance(): FormattedNumber {
        const balanceBN = this.decimals ? new BigNumber(this.holder.balance).div(new BN(10).pow(this.decimals)) : new BigNumber(this.holder.balance)
        return this.formatFloatingPointValue(balanceBN)
    }

    get isERC721(): boolean {
        return this.holderType === TYPES[1]
    }

    get getTokenID(): string {
        return new BN(this.holder['token']).toString()
    }

    get totalSupply(): string {
        if (this.holder && this.holder.tokenInfo && this.holder.tokenInfo.totalSupply) {
            const supply = new BN(this.holder.tokenInfo.totalSupply).toNumber()
            return this.formatNumber(supply)
        }
        return '0'
    }

    /*
    ===================================================================================
     Methods
    ===================================================================================
    */
    /**
     * Sets image exists to false
     */
    onImageLoadFail(): void {
        this.imageExists = false
    }
}
</script>

<style lang="css" scoped>
.table-row-mobile {
    border: 1px solid #b4bfd2;
}
</style>
