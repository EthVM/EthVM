<template>
  <div>
    <app-error :has-error="hasError" :message="error" class="mb-4" />
    <app-details-list v-if="!hasError" :title="title" :details="details" :is-loading="isLoading" class="mb-4" />
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import { Component, Vue, Prop } from 'vue-property-decorator'
import AppError from '@app/core/components/ui/AppError2.vue'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'

@Component({
  components: {
    AppError,
    AppDetailsList
  }
})
export default class HolderDetailsList extends Vue {
  @Prop(String) addressRef: string // Token contract address
  @Prop(Object) contractDetails: any
  @Prop(Object) tokenDetails: any
  @Prop(Object) holderDetails: any
  @Prop(Boolean) isLoading: boolean
  @Prop(String) error: string

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Determines whether or not component has an error.
   * If error property is empty string, there is no error.
   *
   * @return {Boolean} - Whether or not error exists
   */
  get hasError(): boolean {
    return this.error !== ''
  }

  /**
   * Create properly-formatted title from tokenDetails
   *
   * @return {String} - Title for details list
   */
  get title() {
    if (this.isLoading) {
      return ''
    }
    return `<img src="${this.tokenDetails.image}" class="mr-2" style="width: 25px" />  ${
      this.tokenDetails.name
    } (${this.tokenDetails.symbol.toUpperCase()}) - Filtered by Holder`
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
    let details
    if (this.isLoading) {
      details = [
        {
          title: this.$i18n.t('token.holder').toString()
        },
        {
          title: this.$i18n.t('title.contract').toString()
        },
        {
          title: this.$i18n.t('token.balance').toString()
        },
        {
          title: `${this.$i18n.t('token.balance').toString()} (USD)`
        },
        {
          title: this.$i18n.t('token.transfers').toString()
        },
        {
          title: this.$i18n.t('title.marketCap').toString()
        },
        {
          title: this.$i18n.t('title.decimals').toString()
        }
      ]
    } else {
      details = [
        {
          title: this.$i18n.t('token.holder').toString(),
          detail: this.$route.query.holder,
          link: `/address/${this.$route.query.holder}`
        },
        {
          title: this.$i18n.t('title.contract').toString(),
          detail: this.tokenDetails.address,
          link: `/address/${this.tokenDetails.address}`
        },
        {
          title: this.$i18n.t('token.balance').toString(),
          detail: this.holderDetails.tokens ? this.holderDetails.tokens[0].balance : 'N/A'
        },
        {
          title: `${this.$i18n.t('token.balance').toString()} (USD)`,
          detail: this.balanceUsd
        },
        {
          title: this.$i18n.t('token.transfers').toString(),
          detail: this.holderDetails.countTxs
        },
        {
          title: this.$i18n.t('title.marketCap').toString(),
          detail: `$${this.tokenDetails.current_price}`
        },
        {
          title: this.$i18n.t('title.decimals').toString(),
          detail: this.contractDetails.metadata.decimals
        }
      ]
    }
    return details
  }

  get balanceUsd() {
    return this.holderDetails.tokens ? this.tokenDetails.current_price * this.holderDetails.tokens[0].balance : 'N/A'
  }
}
</script>
