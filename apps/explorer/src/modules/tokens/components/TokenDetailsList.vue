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
import { TokenDetailExt } from '@app/core/api/apollo/extensions/token-detail.ext'
import { TokenHolderExt } from '@app/core/api/apollo/extensions/token-holder.ext'
import BN from 'bignumber.js'
import { ConfigHelper } from '@app/core/helper/config-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { FormattedNumber } from '../../../core/helper/number-format-helper'

@Component({
  components: {
    AppDetailsList
  }
})
export default class TokenDetailsList extends Mixins(NumberFormatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string // Token contract address
  @Prop(Object) tokenDetails!: TokenDetailExt
  @Prop(Boolean) isLoading!: boolean
  @Prop(String) error!: string
  @Prop(Object) holderDetails!: TokenHolderExt
  /*
  ===================================================================================
    Initial Values
  ===================================================================================
  */

  icons = {
    blog: 'fab fa-ethereum',
    chat: 'fab fa-ethereum',
    facebook: 'fab fa-facebook',
    forum: 'fas fa-comments',
    github: 'fab fa-github',
    gitter: 'fab fa-gitter',
    instagram: 'fab fa-instagram',
    linkedin: 'fab fa-linkedin',
    reddit: 'fab fa-reddit',
    slack: 'fab fa-slack',
    telegram: 'fab fa-telegram',
    twitter: 'fab fa-twitter',
    youtube: 'fab fa-youtube'
  }

  isRopsten = ConfigHelper.isRopsten

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

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
    if (this.holderDetails && this.holderDetails.address) {
      holder = `- ${this.$t('token.filtered')}`
    }
    return `${name} ${symbol} ${holder}`
  }

  get image(): string {
    return !(this.tokenDetails && this.tokenDetails.logo) ? require('@/assets/icon-token.png') : this.tokenDetails.logo
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
    const details = [this.contractDetail, this.contractOwnerDetail, this.contractDecimalsDetail, this.tokenTypeDetail]
    if (!this.holderDetails) {
      details.push(this.totalHoldersDetail)
    }
    if (!this.isRopsten) {
      details.push(this.priceDetail)
    }
    details.push(this.supplyDetail)
    if (!this.isRopsten) {
      details.push(this.circulatingSupplyDetail, this.marketCapDetail, this.volumeDetail)
    }
    details.push(this.websiteDetail, this.supportDetail, this.socialDetail)
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
    details.push(this.holderTransfersDetail)
    return details.concat(this.tokenDetailsList)
  }

  get contractDetail(): Detail {
    const detail: Detail = { title: this.$tc('contract.name', 1) }
    if (!this.isLoading && this.tokenDetails) {
      detail.detail = new Hex(this.tokenDetails.address).toString()
      detail.link = `/address/${new Hex(this.tokenDetails.address).toString()}`
      detail.copy = true
    }
    return detail
  }

  get contractOwnerDetail(): Detail {
    const detail: Detail = { title: this.$t('token.owner') }
    if (!this.isLoading && this.tokenDetails && this.tokenDetails.owner) {
      detail.detail = this.tokenDetails.owner
      detail.link = `/address/${this.tokenDetails.owner}`
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

  get tokenTypeDetail(): Detail {
    return {
      title: this.$tc('token.type', 1),
      detail: !this.isLoading && this.tokenDetails && this.tokenDetails.contractType ? this.tokenDetails.contractType : undefined
    }
  }

  get priceDetail(): Detail {
    const detail: Detail = { title: this.$i18n.tc('price.name', 1) }

    if (!this.isLoading && this.tokenDetails) {
      let priceFormatted = this.tokenDetails.currentPriceFormatted.value
      if (this.priceChange) {
        priceFormatted += ` (${this.priceChange}%)`
      }
      detail.detail = priceFormatted
      if (this.tokenDetails.currentPriceFormatted.tooltipText) {
        detail.tooltip = this.tokenDetails.currentPriceFormatted.tooltipText
      }
    }
    return detail
  }

  get supplyDetail(): Detail {
    return {
      title: this.$i18n.t('token.supply'),
      detail: !this.isLoading && this.tokenDetails && this.tokenDetails.totalSupply ? this.tokenDetails.totalVolumeFormatted.value : undefined,
      tooltip:
        !this.isLoading && this.tokenDetails && this.tokenDetails.totalSupply && this.tokenDetails.totalVolumeFormatted.tooltipText
          ? this.tokenDetails.totalVolumeFormatted.tooltipText
          : undefined
    }
  }

  get circulatingSupplyDetail(): Detail {
    return {
      title: this.$i18n.t('token.circSupply'),
      detail: !this.isLoading && this.tokenDetails && this.tokenDetails.circulatingSupply ? this.tokenDetails.circulatingSupplyFormatted : undefined
    }
  }

  get marketCapDetail(): Detail {
    const { tokenDetails, isLoading } = this
    return {
      title: this.$i18n.t('token.market'),
      detail: !isLoading && tokenDetails && tokenDetails.marketCap ? this.tokenDetails.marketCapFormatted.value : undefined,
      tooltip:
        !isLoading && tokenDetails && tokenDetails.marketCap && this.tokenDetails.marketCapFormatted.tooltipText
          ? this.tokenDetails.marketCapFormatted.tooltipText
          : undefined
    }
  }

  get volumeDetail(): Detail {
    const { tokenDetails, isLoading } = this
    return {
      title: this.$i18n.t('token.volume'),
      detail: !isLoading && tokenDetails && tokenDetails.totalVolume ? this.tokenDetails.totalVolumeFormatted.value : undefined,
      tooltip:
        !isLoading && tokenDetails && tokenDetails.totalVolume && this.tokenDetails.totalVolumeFormatted.tooltipText
          ? this.tokenDetails.totalVolumeFormatted.tooltipText
          : undefined
    }
  }

  get websiteDetail(): Detail {
    const detail: Detail = { title: this.$i18n.t('token.website') }
    if (!this.isLoading && this.tokenDetails && this.tokenDetails.website) {
      detail.detail = this.tokenDetails.website
      detail.link = `${this.tokenDetails.website}`
    }
    return detail
  }

  get supportDetail(): Detail {
    return {
      title: this.$i18n.t('token.support'),
      detail:
        !this.isLoading && this.tokenDetails && this.tokenDetails.email
          ? `<a href="mailto:${this.tokenDetails.email}" target="_BLANK">${this.tokenDetails.email}</a>`
          : undefined
    }
  }

  get socialDetail(): Detail {
    const detail: Detail = { title: this.$i18n.t('token.links') }
    if (!this.isLoading && this.tokenDetails && this.tokenDetails.social) {
      detail.detail = Object.entries(this.tokenDetails.social)
        .map(obj => {
          const name = obj[0]
          const url = obj[1]
          if (url === null || url === '') {
            return ''
          }
          return `<a href="${url}" target="_BLANK"><i aria-hidden="true" class="v-icon primary--text ${
            this.icons[name]
          } pr-2 material-icons theme--light"></i></a>`
        })
        .reduce((a, b) => {
          return `${a}${b}`
        })
    }
    return detail
  }

  get totalHoldersDetail(): Detail {
    return {
      title: this.$i18n.t('token.holder-total'),
      detail: !this.isLoading && this.tokenDetails ? this.tokenDetails.holdersCount || 0 : undefined
    }
  }

  get holderDetail(): Detail {
    const detail: Detail = { title: this.$t('token.holder') }
    if (!this.isLoading && this.holderDetails && this.holderDetails.address) {
      detail.detail = this.holderDetails.address
      detail.link = `/address/${this.holderDetails.address}`
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

  get holderTransfersDetail(): Detail {
    const { holderDetails, isLoading } = this
    return {
      title: this.$t('token.transfers'),
      detail: !isLoading && holderDetails && holderDetails.totalTransfersBN ? this.holderDetails.totalTransfersFormatted : undefined
    }
  }

  get balanceUsd(): string | undefined {
    const { holderDetails, tokenDetails } = this

    if (!holderDetails) {
      return ''
    }

    const decimals = tokenDetails.decimals
    let n = holderDetails.balanceBN

    if (decimals) {
      n = n.div(new BN(10).pow(decimals))
    }

    return holderDetails.balance && tokenDetails.currentPrice ? this.formatUsdValue(n.multipliedBy(tokenDetails.currentPrice), false).value : undefined
  }

  get balance(): FormattedNumber {
    const decimals = this.tokenDetails.decimals
    let n = this.holderDetails.balanceBN
    if (decimals) {
      n = n.div(new BN(10).pow(decimals))
    }
    return this.formatFloatingPointValue(n)
  }

  get priceChange(): string | undefined {
    if (this.tokenDetails.priceChangePercentage24h) {
      const value = this.tokenDetails.priceChangePercentage24hFormatted
      return this.tokenDetails.priceChangePercentage24h > 0 ? `+${value}` : value
    }
  }
}
</script>
