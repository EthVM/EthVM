<template>
  <div>
    <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4" />
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { StringConcatMixin } from '@app/core/components/mixins'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import BN from 'bignumber.js'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenHolderExt } from '@app/core/api/apollo/extensions/token-holder.ext'
import { TokenDetailExt } from '@app/core/api/apollo/extensions/token-detail.ext'

@Component({
  components: {
    AppDetailsList
  }
})
export default class HolderDetailsList extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string // Token contract address
  @Prop(Object) tokenDetails!: TokenDetailExt
  @Prop(Object) holderDetails!: TokenHolderExt
  @Prop(Boolean) isLoading!: boolean
  @Prop(String) error!: string

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
  get title() {
    if (this.isLoading) {
      return ''
    }
    const { tokenDetails } = this
    const logoSrc = tokenDetails && tokenDetails.logo ? tokenDetails.logo : require('@/assets/not-found.png')
    const tokenLabel = tokenDetails.symbol
      ? `${tokenDetails.name} (${tokenDetails.symbol!.toUpperCase()})`
      : `${tokenDetails.name}`
    return `<img src="${logoSrc}" class="mr-2 token-image" />  ${tokenLabel} - Filtered by Holder`
  }

  /**
   * Properly format the Details[] array for the details table
   */
  get details(): Detail[] {
    const icons = {
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
    let details: Detail[]
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('token.holder')
        },
        {
          title: this.$i18n.tc('contract.name', 2)
        },
        {
          title: this.$i18n.t('common.balance')
        },
        {
          title: this.$i18n.t('usd.total')
        },
        {
          title: this.$i18n.t('token.transfers')
        },
        {
          title: this.$i18n.t('token.market')
        },
        {
          title: this.$i18n.t('token.decimals')
        }
      ]
    } else {

      let balanceLabel = this.holderDetails && this.holderDetails.balance ? `${this.balance}` : 'N/A'
      if (this.tokenDetails.symbol) {
        balanceLabel += ` (${this.tokenDetails.symbol!.toUpperCase()})`
      }

      details = [
        {
          title: this.$i18n.t('token.holder').toString(),
          detail: this.$route.query.holder.toString(),
          link: `/address/${this.$route.query.holder}`,
          copy: true
        },
        {
          title: this.$i18n.tc('contract.name', 2),
          detail: `0x${this.tokenDetails.address}`,
          link: `/address/0x${this.tokenDetails.address}`,
          copy: true
        },
        {
          title: this.$i18n.t('common.balance').toString(),
          detail: balanceLabel
        }
      ]

      const { decimals, currentPrice } = this.tokenDetails

      if (currentPrice) {
        details.push({
          title: this.$i18n.t('token.market').toString(),
          detail: `$${this.getRoundNumber(currentPrice)}`,
          priceChange: this.getPriceChange()
        })
      }

      if (this.balanceUsd) {
        details.push({
          title: this.$i18n.t('usd.total'),
          detail: this.balanceUsd
        })
      }

      if (decimals) {
        details.push({
          title: this.$i18n.t('token.decimals'),
          detail: decimals || undefined
        })
      }
    }
    return details
  }

  get balanceUsd(): string | undefined {
    if (!this.holderDetails) {
      return ''
    }

    const decimals = this.tokenDetails.decimals
    let n = new BN(this.holderDetails.balance)

    if (decimals) {
      n = n.div(new BN(10).pow(decimals))
    }

    return this.holderDetails.balance && this.tokenDetails.currentPrice ? `$${this.getRoundNumber(n.multipliedBy(this.tokenDetails.currentPrice))}` : undefined
  }

  get balance(): string {
    const decimals = this.tokenDetails.decimals
    let n = new BN(this.holderDetails.balance)
    if (decimals) {
      n = n.div(new BN(10).pow(decimals))
    }
    return this.getRoundNumber(n)
  }

  //Methods:
  getPriceChange(): string {
    return this.tokenDetails.priceChangePercentage24h > 0
      ? `+${this.getPercent(this.tokenDetails.priceChangePercentage24h)}`
      : this.getPercent(this.tokenDetails.priceChangePercentage24h)
  }
}
</script>
