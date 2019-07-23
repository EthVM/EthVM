<template>
  <div>
    <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4" />
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Hex } from '@app/core/models'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenDetailExt } from '@app/core/api/apollo/extensions/token-detail.ext'

@Component({
  components: {
    AppDetailsList
  }
})
export default class TokenDetailsList extends Mixins(StringConcatMixin) {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef!: string // Token contract address
  @Prop(Object) tokenDetails!: TokenDetailExt
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
    if (this.isLoading || this.error !== '') {
      return ''
    }
    const { tokenDetails } = this
    const logoSrc = tokenDetails && tokenDetails.logo ? tokenDetails.logo : require('@/assets/not-found.png')
    const tokenLabel = tokenDetails.symbol ? `${tokenDetails.name} (${tokenDetails.symbol!.toUpperCase()})` : `${tokenDetails.name}`
    return `<img src="${logoSrc}" class="mr-2 token-image" /> ${tokenLabel}`
  }

  /**
   * Properly format the Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
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
          title: this.$i18n.tc('contract.name', 1)
        },
        {
          title: this.$i18n.t('token.owner')
        },
        {
          title: this.$i18n.t('token.supply')
        },
        {
          title: this.$i18n.tc('price.name', 2)
        },
        {
          title: this.$i18n.t('token.market')
        },
        {
          title: this.$i18n.t('token.holder-total')
        },
        {
          title: this.$i18n.t('token.decimals')
        },
        {
          title: this.$i18n.t('token.website')
        },
        {
          title: this.$i18n.t('token.support')
        },
        {
          title: this.$i18n.t('token.links')
        }
      ]
    } else {
      const { address, holdersCount, owner, decimals, website, email, contractType, social, totalVolume } = this.tokenDetails
      const { totalSupplyBN, circulatingSupplyBN, currentPriceBN, marketCapBN } = this.tokenDetails

      details = [
        {
          title: this.$i18n.tc('contract.name', 1),
          detail: new Hex(address!).toString(),
          link: this.tokenDetails ? `/address/${new Hex(address!).toString()}` : ''
        }
      ]

      if (owner) {
        details.push({
          title: this.$i18n.t('token.owner'),
          detail: owner,
          link: `/address/${owner}`
        })
      }

      if (totalSupplyBN) {
        details.push({
          title: this.$i18n.t('token.supply'),
          detail: this.formatStr(totalSupplyBN.toString())
        })
      }

      if (circulatingSupplyBN) {
        details.push({
          title: this.$i18n.t('token.circSupply').toString(),
          detail: this.formatStr(circulatingSupplyBN.toString())
        })
      }

      if (currentPriceBN) {
        details.push({
          title: this.$i18n.tc('price.name', 2),
          detail: `$${currentPriceBN}`,
          priceChange: this.getPriceChange()
        })
      }

      if (marketCapBN) {
        details.push({
          title: this.$i18n.t('token.market'),
          detail: `$${this.getRoundNumber(marketCapBN)}`
        })
      }

      if (totalVolume) {
        details.push({
          title: this.$i18n.t('token.volume').toString(),
          detail: `$${this.getInt(totalVolume)}`
        })
      }

      if (holdersCount) {
        details.push({
          title: this.$i18n.t('token.holder-total'),
          detail: holdersCount
        })
      }

      if (decimals) {
        details.push({
          title: this.$i18n.t('token.decimals'),
          detail: decimals
        })
      }

      if (website) {
        details.push({
          title: this.$i18n.t('token.website'),
          detail: `<a href="${website}" target="_BLANK">${website}</a>`
        })
      }

      if (email) {
        details.push({
          title: this.$i18n.t('token.support'),
          detail: `<a href="mailto:${email}" target="_BLANK">${email}</a>`
        })
      }

      if (contractType) {
        details.push({
          title: this.$i18n.t('token.type').toString(),
          detail: contractType
        })
      }

      if (social) {
        details.push({
          title: this.$i18n.t('token.links'),
          detail: Object.entries(social)
            .map(obj => {
              const name = obj[0]
              const url = obj[1]
              if (url === null || url === '') {
                return ''
              }
              return `<a href="${url}" target="_BLANK"><i aria-hidden="true" class="v-icon primary--text ${
                icons[name]
              } pr-2 material-icons theme--light"></i></a>`
            })
            .reduce((a, b) => {
              return `${a}${b}`
            })
        })
      }
    }
    return details
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getPriceChange(): string {
    return this.tokenDetails.priceChangePercentage24h > 0
      ? `+${this.getPercent(this.tokenDetails.priceChangePercentage24h)}`
      : this.getPercent(this.tokenDetails.priceChangePercentage24h)
  }
}
</script>
