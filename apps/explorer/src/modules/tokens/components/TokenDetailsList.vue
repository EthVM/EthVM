<template>
  <div>
    <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4" />
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { Hex } from '@app/core/models'

@Component({
  components: {
    AppDetailsList
  }
})
export default class TokenDetailsList extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop(String) addressRef: string // Token contract address
  @Prop(Object) contractDetails: any
  @Prop(Object) tokenDetails: any
  @Prop(Boolean) isLoading: boolean
  @Prop(String) error: string

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
          title: this.$i18n.t('title.contract')
        },
        {
          title: this.$i18n.t('token.owner')
        },
        {
          title: this.$i18n.t('title.supply')
        },
        {
          title: this.$i18n.t('title.price')
        },
        {
          title: this.$i18n.t('title.marketCap')
        },
        {
          title: this.$i18n.t('token.totalHold')
        },
        {
          title: this.$i18n.t('title.decimals')
        },
        {
          title: this.$i18n.t('title.website')
        },
        {
          title: this.$i18n.t('title.support')
        },
        {
          title: this.$i18n.t('title.links')
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('title.contract'),
          detail: new Hex(this.tokenDetails.address).toString(),
          link: this.tokenDetails ? `/address/${new Hex(this.tokenDetails.address).toString()}` : ''
        },
        {
          title: this.$i18n.t('token.owner'),
          detail: this.tokenDetails.owner ? this.tokenDetails.owner : 'REQUIRED DATA',
          link: `/address/${this.tokenDetails.owner}`
        },
        {
          title: this.$i18n.t('title.supply'),
          detail: this.tokenDetails.totalSupply
        },
        {
          title: this.$i18n.t('title.price'),
          detail: `$${this.tokenDetails.currentPrice} (${this.tokenDetails.priceChangePercentage24h}%)`
        },
        {
          title: this.$i18n.t('title.marketCap'),
          detail: `$${this.tokenDetails.marketCap}`
        },
        {
          title: this.$i18n.t('token.totalHold'),
          detail: this.tokenDetails.holdersCount ? `${this.tokenDetails.holdersCount}` : 'REQUIRED DATA'
        },
        {
          title: this.$i18n.t('title.decimals'),
          detail: this.contractDetails.metadata.decimals
        },
        {
          title: this.$i18n.t('title.website'),
          detail: `<a href="${this.contractDetails.metadata.website}" target="_BLANK">${this.contractDetails.metadata.website}</a>`
        },
        {
          title: this.$i18n.t('title.support'),
          detail: this.contractDetails.metadata.support
            ? `<a href="mailto:${this.contractDetails.metadata.support.email}" target="_BLANK">${this.contractDetails.metadata.support.email}</a>`
            : 'REQUIRED DATA'
        },
        {
          title: this.$i18n.t('title.links'),
          detail: Object.entries(this.contractDetails.metadata.social)
            .map(obj => {
              const name = obj[0]
              const url = obj[1]
              if (url === null || url === '') {
                return ''
              }
              return `<a href="${url}" target="_BLANK"><i aria-hidden="true" class="v-icon secondary--text ${
                icons[name]
              } pr-2 material-icons theme--light"></i></a>`
            })
            .reduce((a, b) => {
              return `${a}${b}`
            })
        }
      ]
    }
    return details
  }
}
</script>
