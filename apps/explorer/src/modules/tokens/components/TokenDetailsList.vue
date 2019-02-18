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
    let details
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('title.contract').toString()
        },
        {
          title: this.$i18n.t('token.owner').toString()
        },
        {
          title: this.$i18n.t('title.supply').toString()
        },
        {
          title: this.$i18n.t('title.price').toString()
        },
        {
          title: this.$i18n.t('title.marketCap').toString()
        },
        {
          title: this.$i18n.t('token.totalHold').toString()
        },
        {
          title: this.$i18n.t('title.decimals').toString()
        },
        {
          title: this.$i18n.t('title.website').toString()
        },
        {
          title: this.$i18n.t('title.support').toString()
        },
        {
          title: this.$i18n.t('title.links').toString()
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('title.contract').toString(),
          detail: new Hex(this.tokenDetails.address).toString(),
          link: this.tokenDetails ? `/address/${new Hex(this.tokenDetails.address).toString()}` : ''
        },
        {
          title: this.$i18n.t('token.owner').toString(),
          detail: this.tokenDetails.owner ? this.tokenDetails.owner : 'REQUIRED DATA',
          link: `/address/${this.tokenDetails.owner}`
        },
        {
          title: this.$i18n.t('title.supply').toString(),
          detail: this.tokenDetails.total_supply
        },
        {
          title: this.$i18n.t('title.price').toString(),
          detail: `$${this.tokenDetails.current_price} (${this.tokenDetails.price_change_percentage_24h}%)`
        },
        {
          title: this.$i18n.t('title.marketCap').toString(),
          detail: `$${this.tokenDetails.market_cap}`
        },
        {
          title: this.$i18n.t('token.totalHold').toString(),
          detail: this.tokenDetails.holdersCount ? `${this.tokenDetails.holdersCount}` : 'REQUIRED DATA'
        },
        {
          title: this.$i18n.t('title.decimals').toString(),
          detail: this.contractDetails.metadata.decimals
        },
        {
          title: this.$i18n.t('title.website').toString(),
          detail: `<a href="${this.contractDetails.metadata.website}" target="_BLANK">${this.contractDetails.metadata.website}</a>`
        },
        {
          title: this.$i18n.t('title.support').toString(),
          detail: `<a href="mailto:${this.contractDetails.metadata.support.email}" target="_BLANK">${this.contractDetails.metadata.support.email}</a>`
        },
        {
          title: this.$i18n.t('title.links').toString(),
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
