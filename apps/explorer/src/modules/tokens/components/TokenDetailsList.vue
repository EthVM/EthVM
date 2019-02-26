<template>
  <div>
    <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4" />
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Hex } from '@app/core/models'

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
  @Prop(Object) contractDetails!: any
  @Prop(Object) tokenDetails!: any
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
    return `<img src="${this.tokenDetails.image}" class="mr-2" style="width: 25px" /> ${this.tokenDetails.name} (${this.tokenDetails.symbol.toUpperCase()})`
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

      const detailsItems: Detail[] = [
        {
          title: this.$i18n.tc('contract.name', 1),
          detail: new Hex(this.tokenDetails.address).toString(),
          link: this.tokenDetails ? `/address/${new Hex(this.tokenDetails.address).toString()}` : ''
        }
      ]

      if (this.tokenDetails.owner) {
        detailsItems.push({
          title: this.$i18n.t('token.owner'),
          detail: this.tokenDetails.owner,
          link: `/address/${this.tokenDetails.owner}`
        })
      }

      detailsItems.push( {
          title: this.$i18n.t('token.supply'),
          detail: this.formatStr(this.tokenDetails.totalSupply.toString())
        },
        {
          title: this.$i18n.tc('price.name', 2),
          detail: `$${this.tokenDetails.currentPrice}`,
          priceChange: this.getPriceChange()
        },
        {
          title: this.$i18n.t('token.market'),
          detail: `$${this.getRoundNumber(this.tokenDetails.marketCap)}`
        })

      if (this.tokenDetails.holdersCount) {
        detailsItems.push( {
          title: this.$i18n.t('token.holder-total'),
          detail: this.tokenDetails.holdersCount
        })
      }

      detailsItems.push( {
        title: this.$i18n.t('token.decimals'),
        detail: this.contractDetails.metadata.decimals
      })

      if (this.contractDetails.metadata.website) {
        detailsItems.push({
          title: this.$i18n.t('token.website'),
          detail: `<a href="${this.contractDetails.metadata.website}" target="_BLANK">${this.contractDetails.metadata.website}</a>`
        })
      }

      if (this.contractDetails.metadata.support) {
        detailsItems.push({
          title: this.$i18n.t('token.support'),
          detail: `<a href="mailto:${this.contractDetails.metadata.support.email}" target="_BLANK">${this.contractDetails.metadata.support.email}</a>`
        })
      }

      if (this.contractDetails.metadata.social) {
        detailsItems.push({
          title: this.$i18n.t('token.links'),
          detail: Object.entries(this.contractDetails.metadata.social)
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

      details = detailsItems
    }
    return details
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getPriceChange(): string {
    return this.tokenDetails.priceChangePercentage24h > 0 ? '+' + this.getPercent(this.tokenDetails.priceChangePercentage24h) : this.getPercent(this.tokenDetails.priceChangePercentage24h)
  }
}
</script>
