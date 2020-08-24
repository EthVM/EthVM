<template>
    <div>
        <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4">
            <template v-slot:title>
                <v-layout grid-list-xs row align-center justify-start fill-height pl-4 pr-2 pt-2 pb-2>
                    <div class="token-image">
                        <v-img :src="image" contain />
                    </div>
                    <v-card-title class="title font-weight-bold pl-1">{{ title }}</v-card-title>
                </v-layout>
            </template>
        </app-details-list>
    </div>
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

@Component({
    components: {
        AppDetailsList
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
    @Prop(Object) holderDetails!: TokenOwnerInfo
    /*
  ===================================================================================
    Initial Values
  ===================================================================================
  */
    error = ''
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
    Computed Values
  ===================================================================================
  */

    get tokenData(): TokenMarketData | false {
        if (this.addressRef) {
            return this.getEthereumTokenByContract(this.addressRef)
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
            symbol = this.tokenDetails.symbol === null ? symbol : `(${this.tokenDetails.symbol.toUpperCase()}) `
        }
        if (this.holderDetails && this.holderDetails.owner) {
            holder = `- ${this.$t('token.filtered')}`
        }
        return `${name} ${symbol} ${holder}`
    }

    get image(): string {
        return !(this.tokenData && this.tokenData.image) ? require('@/assets/icon-token.png') : this.tokenData.image
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
        const details = [this.contractDetail, this.contractDecimalsDetail]
        if (this.holderDetails && this.holderDetails.owner) {
            details.push(this.contractOwnerDetail)
        }
        if (!this.holderDetails) {
            // details.push(this.totalHoldersDetail)
        }
        if (!this.isRopsten) {
            details.push(this.priceDetail)
        }
        details.push(this.supplyDetail)
        if (!this.isRopsten) {
            details.push(this.marketCapDetail, this.volumeDetail)
        }
        // details.push(this.websiteDetail, this.supportDetail, this.socialDetail)
        return details
    }

    /**
     * Get details list for holder detail view
     */
    get holderDetailsList(): Detail[] {
        const details = [this.holderDetail, this.holderBalanceDetail]
        if (!this.isRopsten) {
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
        }
        return detail
    }

    get contractOwnerDetail(): Detail {
        const detail: Detail = { title: this.$t('token.owner') }
        if (!this.isLoading && this.holderDetails && this.holderDetails.owner) {
            detail.detail = this.holderDetails.owner
            detail.link = `/address/${this.holderDetails.owner}`
            detail.copy = true
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
            detail.priceChange = this.formatPercentageValue(new BN(this.tokenData.price_change_24h || 0)).value
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
        const detail: Detail = { title: this.$t('token.holder') }
        if (!this.isLoading && this.holderDetails && this.holderDetails.owner) {
            detail.detail = this.holderDetails.owner
            detail.link = `/address/${this.holderDetails.owner}`
            detail.copy = true
        }
        return detail
    }

    get holderBalanceDetail(): Detail {
        const detail: Detail = { title: this.$t('common.balance') }
        if (!this.isLoading && this.tokenDetails && this.holderDetails) {
            const symbol = this.tokenDetails.symbol === null ? '' : ` ${this.tokenDetails.symbol.toUpperCase()}`
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
