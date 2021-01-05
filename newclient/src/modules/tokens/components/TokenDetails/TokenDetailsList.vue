<template>
    <v-layout row wrap justify-start class="mb-4">
        <v-flex xs12>
            <app-details-list :title="title" :details="details" :is-loading="isLoading || hasError" :max-items="10" class="mb-4">
                <template #title>
                    <v-layout grid-list-xs row align-center justify-space-between fill-height pl-4 pr-2>
                        <v-flex>
                            <v-layout grid-list-xs row align-center justify-start class="token-header">
                                <div class="token-header-image">
                                    <v-img :src="image" contain @error="imgLoadFail" />
                                </div>
                                <v-card-title class="title font-weight-bold pl-3">{{ title }}</v-card-title>
                            </v-layout>
                        </v-flex>
                        <v-flex v-if="!isNft" text-xs-right py-0>
                            <fav-handler-heart-actions :symbol="symbol" :address="address" />
                        </v-flex>
                    </v-layout>
                    <v-divider class="lineGrey" />
                </template>
            </app-details-list>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { Hex } from '@app/core/models'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import BN from 'bignumber.js'
import { ConfigHelper } from '@app/core/helper/config-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { getLatestPrices_getLatestPrices as TokenMarketData } from '@app/core/components/mixins/CoinData/apolloTypes/getLatestPrices'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/ERC20TokenOwnerDetails.ts'
import { TokenDetails as TokenInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/TokenDetails'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'
import FavHandlerHeartActions from '@app/modules/favorite-tokens/handlers/FavHandlerHeartActions.vue'
@Component({
    components: {
        AppDetailsList,
        FavHandlerHeartActions
    }
})
export default class TokenDetailsList extends Mixins(NumberFormatMixin, CoinData) {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop(String) addressRef!: string // Token contract address
    @Prop(Object) tokenDetails!: TokenInfo
    @Prop(Boolean) isLoading!: boolean
    @Prop(Boolean) isNft!: boolean
    @Prop(Object) holderDetails!: TokenOwnerInfo
    /*
  ===================================================================================
    Initial Values
  ===================================================================================
  */
    // icons = {
    //     blog: 'fab fa-ethereum',
    //     chat: 'fab fa-ethereum',
    //     facebook: 'fab fa-facebook',
    //     forum: 'fas fa-comments',
    //     github: 'fab fa-github',
    //     gitter: 'fab fa-gitter',
    //     instagram: 'fab fa-instagram',
    //     linkedin: 'fab fa-linkedin',
    //     reddit: 'fab fa-reddit',
    //     slack: 'fab fa-slack',
    //     telegram: 'fab fa-telegram',
    //     twitter: 'fab fa-twitter',
    //     youtube: 'fab fa-youtube'
    // }
    // tokenData: TokenMarketData | null = null
    isRopsten = ConfigHelper.isRopsten
    hasError = false
    imageExists = true
    /*
  ===================================================================================
        LifeCycle:
  ===================================================================================
    */
    // mounted() {
    //     if (this.addressRef) {
    //         this.$CD
    //             .getEthereumTokenByContract(this.addressRef)
    //             .then(data => {
    //                 this.tokenData = data ? data : null
    //             })
    //             .catch(error => {
    //                 this.error = `${this.$t('message.no-data')}`
    //             })
    //     }
    // }

    /*
    ===================================================================================
      Methods:
    ===================================================================================
    */
    /**
     * Emit error to Sentry
     * @param val {Boolean}
     */
    emitErrorState(val: boolean): void {
        this.hasError = val
        this.$emit('errorDetails', val, ErrorMessageToken.details)
    }

    /**
     * Image loading failed catcher
     */
    imgLoadFail(): void {
        this.imageExists = false
    }

    /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */
    get symbol(): string | null {
        return this.tokenDetails ? this.tokenDetails.symbol : ''
    }

    get address(): string | null {
        return this.tokenDetails ? this.tokenDetails.contract : ''
    }
    get tokenData(): TokenMarketData | false {
        if (this.addressRef) {
            try {
                this.emitErrorState(false)
                return this.getEthereumTokenByContract(this.addressRef)
            } catch (error) {
                this.emitErrorState(true)
            }
        }
        return false
    }

    /**
     * Create properly-formatted title from tokenDetails
     *
     * @return {String} - Title for details list
     */
    get title(): string {
        let name = this.$tc('token.name', 1)
        let symbol = ''
        let holder = ''
        if (this.tokenDetails && !this.isLoading) {
            name = this.tokenDetails.name === null ? name : this.tokenDetails.name
            symbol = this.tokenDetails.symbol === null || !this.tokenDetails.symbol ? symbol : `(${this.tokenDetails.symbol.toUpperCase()}) `
        }
        if (this.holderDetails && this.holderDetails.owner) {
            holder = `- ${this.$t('token.filtered')}`
        }
        return `${name} ${symbol} ${holder}`
    }

    get image(): string {
        return !(this.tokenData && this.tokenData.image && this.imageExists) ? require('@/assets/icon-token.png') : this.tokenData.image
    }

    /**
     * Properly format the Details[] array for the details table.
     * If the data hasn't been loaded yet, then only include the titles in the details.
     */
    get details(): Detail[] {
        return this.holderDetails ? this.holderDetailsList : this.tokenDetailsList
    }

    /**
     * Get details list for token detail view
     */
    get tokenDetailsList(): Detail[] {
        const details = [this.contractDetail]
        this.contractDecimalsDetail.detail ? details.push(this.contractDecimalsDetail) : null
        if (this.holderDetails && this.holderDetails.owner && this.contractOwnerDetail.detail) {
            details.push(this.contractOwnerDetail)
        }
        if (!this.holderDetails) {
            // details.push(this.totalHoldersDetail)
        }
        if (!this.isRopsten && this.priceDetail.detail) {
            details.push(this.priceDetail)
        }
        this.supplyDetail.detail ? details.push(this.supplyDetail) : null
        if (!this.isRopsten) {
            this.marketCapDetail.detail ? details.push(this.marketCapDetail) : null
            this.volumeDetail.detail ? details.push(this.volumeDetail) : null
        }
        // details.push(this.websiteDetail, this.supportDetail, this.socialDetail)
        return details
    }

    /**
     * Get details list for holder detail view
     */
    get holderDetailsList(): Detail[] {
        const details = [this.holderDetail, this.holderBalanceDetail]
        if (!this.isRopsten && this.holderUsdDetail.detail) {
            details.push(this.holderUsdDetail)
        }
        // details.push(this.holderTransfersDetail)
        return details.concat(this.tokenDetailsList)
    }

    get contractDetail(): Detail {
        const detail: Detail = { title: this.$tc('contract.name', 1) }
        if (!this.isLoading && this.tokenDetails) {
            detail.detail = new Hex(this.tokenDetails.contract).toString()
            detail.link = `/address/${new Hex(this.tokenDetails.contract).toString()}`
            detail.copy = true
            detail.toChecksum = true
        }
        return detail
    }

    get contractOwnerDetail(): Detail {
        const detail: Detail = { title: this.$t('token.owner') }
        if (!this.isLoading && this.holderDetails && this.holderDetails.owner) {
            detail.detail = this.holderDetails.owner
            detail.link = `/address/${this.holderDetails.owner}`
            detail.copy = true
            detail.toChecksum = true
        }
        return detail
    }

    get contractDecimalsDetail(): Detail {
        return {
            title: this.$t('token.decimals'),
            detail: !this.isLoading && this.tokenDetails && this.tokenDetails.decimals != null ? this.tokenDetails.decimals : undefined
        }
    }

    get priceDetail(): Detail {
        const detail: Detail = { title: this.$i18n.tc('price.name', 1) }
        if (!this.isLoading && this.tokenData) {
            const priceFormatted = this.formatUsdValue(new BN(this.tokenData.current_price || 0))
            detail.detail = priceFormatted.value
            detail.priceChange = this.tokenData.price_change_percentage_24h
            if (priceFormatted.tooltipText) {
                detail.tooltip = priceFormatted.tooltipText
            }
        }
        return detail
    }

    get supplyDetail(): Detail {
        let supply: number | undefined = undefined
        if (this.tokenData && this.tokenData.total_supply) {
            supply = new BN(this.tokenData.total_supply).toNumber()
        }
        return {
            title: this.$i18n.t('token.supply'),
            detail: !this.isLoading && supply ? this.formatNumber(supply) : undefined
            // tooltip:
            //     !this.isLoading && this.tokenDetails && this.tokenDetails.totalSupply && this.tokenDetails.totalSupplyFormatted.tooltipText
            //         ? this.tokenDetails.totalSupplyFormatted.tooltipText
            //         : undefined
        }
    }

    get marketCapDetail(): Detail {
        return {
            title: this.$i18n.t('token.market'),
            detail: !this.isLoading && this.tokenData && this.tokenData.market_cap ? this.formatNumber(this.tokenData.market_cap) : undefined
        }
    }

    get volumeDetail(): Detail {
        return {
            title: this.$i18n.t('token.volume'),
            detail: !this.isLoading && this.tokenData && this.tokenData.total_volume ? this.formatNumber(this.tokenData.total_volume) : undefined
        }
    }

    //TODO: Figure out where is website
    get websiteDetail(): Detail {
        const detail: Detail = { title: this.$i18n.t('token.website') }
        // if (!this.isLoading && this.tokenData && this.tokenData.website) {
        //     detail.detail = this.tokenData.website
        //     detail.link = `${this.tokenData.website}`
        // }
        return detail
    }

    //TODO: Figure out where is email
    get supportDetail(): Detail {
        return {
            title: this.$i18n.t('token.support')
            // detail:
            //     !this.isLoading && this.tokenDetails && this.tokenDetails.email
            //         ? `<a href="mailto:${this.tokenDetails.email}" target="_BLANK">${this.tokenDetails.email}</a>`
            //         : undefined
        }
    }

    //TODO: Figure out where is socialDetail
    get socialDetail(): Detail {
        const detail: Detail = { title: this.$i18n.t('token.links') }
        // if (!this.isLoading && this.tokenDetails && this.tokenDetails.social) {
        //     detail.detail = Object.entries(this.tokenDetails.social)
        //         .map(obj => {
        //             const name = obj[0]
        //             const url = obj[1]
        //             if (url === null || url === '') {
        //                 return ''
        //             }
        //             return `<a href="${url}" target="_BLANK"><i aria-hidden="true" class="v-icon primary--text ${this.icons[name]} pr-2 material-icons theme--light"></i></a>`
        //         })
        //         .reduce((a, b) => {
        //             return `${a}${b}`
        //         })
        // }
        return detail
    }

    //TODO: Figure out where totalHolders is
    // get totalHoldersDetail(): Detail {
    //     return {
    //         title: this.$i18n.t('token.holder-total')
    //         // detail: !this.isLoading && this.tokenDetails ? this.tokenDetails.holdersCount || 0 : undefined
    //     }
    // }

    get holderDetail(): Detail {
        const detail: Detail = { title: this.$tc('token.holder', 1) }
        if (!this.isLoading && this.holderDetails && this.holderDetails.owner) {
            detail.detail = this.holderDetails.owner
            detail.link = `/address/${this.holderDetails.owner}`
            detail.copy = true
            detail.toChecksum = true
        }
        return detail
    }

    get holderBalanceDetail(): Detail {
        const detail: Detail = { title: this.$t('common.balance') }
        if (!this.isLoading && this.tokenDetails && this.holderDetails) {
            const symbol = this.tokenDetails.symbol === null || !this.tokenDetails.symbol ? '' : ` ${this.tokenDetails.symbol.toUpperCase()}`
            detail.detail = `${this.balance.value}${symbol}`
            detail.tooltip = this.balance.tooltipText ? this.balance.tooltipText : undefined
        }
        return detail
    }

    get holderUsdDetail(): Detail {
        return {
            title: this.$t('usd.total'),
            detail: !this.isLoading && this.tokenDetails ? this.balanceUsd : undefined
        }
    }

    //TODO: Figure out where totalTransfer is
    // get holderTransfersDetail(): Detail {
    //     const { holderDetails, isLoading } = this
    //     return {
    //         title: this.$t('token.transfers')
    //         detail: !isLoading && holderDetails && holderDetails.totalTransfersBN ? this.holderDetails.totalTransfersFormatted.value : undefined,
    //         tooltip:
    //             !isLoading && holderDetails && holderDetails.totalTransfersBN && this.holderDetails.totalTransfersFormatted.tooltipText
    //                 ? this.holderDetails.totalTransfersFormatted.tooltipText
    //                 : undefined
    //     }
    // }

    get balanceUsd(): string | undefined {
        if (!this.holderDetails) {
            return ''
        }

        const decimals = this.tokenDetails.decimals
        let n = new BN(this.holderDetails.balance)

        if (decimals) {
            n = n.div(new BN(10).pow(decimals))
        }

        return this.holderDetails.balance && this.tokenData && this.tokenData.current_price
            ? this.formatUsdValue(n.multipliedBy(this.tokenData.current_price)).value
            : undefined
    }

    get balance(): FormattedNumber {
        const decimals = this.tokenDetails.decimals
        let n = new BN(this.holderDetails.balance)
        if (decimals) {
            n = n.div(new BN(10).pow(decimals))
        }
        return this.formatFloatingPointValue(n)
    }
}
</script>
<style lang="scss" scoped>
.token-header {
    min-height: 56px;
    .token-header-image {
        width: 30px;
    }
}
</style>
