<template>
  <v-card color="white" flat class="pt-3">
    <v-card-title class="title font-weight-bold pl-4">{{ token.name }} ({{ token.symbol }})</v-card-title>
    <v-divider class="lineGrey" />
    <v-list>
      <v-list-tile v-for="(item, index) in details" :key="index">
        <v-layout align-center justify-start row fill-height class="pa-3">
          <v-flex xs4 sm3 md2>
            <v-list-tile-title class="info--text font-weight-medium" v-html="item.title"></v-list-tile-title>
          </v-flex>
          <v-flex xs7 sm8 md9>
            <v-list-tile-title v-if="!item.link" class="text-muted text-truncate" v-html="item.detail"></v-list-tile-title>
            <router-link v-else :to="item.link">
              <v-list-tile-title class="text-truncate" v-html="item.detail"></v-list-tile-title>
            </router-link>
          </v-flex>
        </v-layout>
      </v-list-tile>
    </v-list>
  </div>
  </v-card>
</template>

<script lang="ts">
import AppInfoLoad from '@app/core/components/ui/AppInfoLoad.vue'
import AppListDetails from '@app/core/components/ui/AppListDetails.vue'
import AppListTitle from '@app/core/components/ui/AppListTitle.vue'
import { Detail } from '@app/core/components/props'
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  components: {
    AppInfoLoad,
    AppListDetails,
    AppListTitle
  }
})
export default class DetailsListTokens extends Vue {
  @Prop(Object) contract: Object<any>
  @Prop(Object) token: Object<any>

  listType = 'tx'

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

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
    return [
      {
        title: this.$i18n.t('title.contract'),
        detail: this.token.address,
        link: `/address/${this.token.address}`
      },
      {
        title: this.$i18n.t('token.owner'),
        detail: this.token.owner,
        link: `/address/${this.token.owner}`
      },
      {
        title: this.$i18n.t('title.supply'),
        detail: this.token.totalSupply
      },
      {
        title: this.$i18n.t('title.price'),
        detail: `$${this.token.price.rate} (${this.token.price.diff}%)`
      },
      {
        title: this.$i18n.t('title.marketCap'),
        detail: `$${this.token.price.marketCapUsd}`
      },
      {
        title: this.$i18n.t('token.totalHold'),
        detail: `${this.token.holdersCount}`
      },
      {
        title: this.$i18n.t('title.decimals'),
        detail: this.contract.metadata.decimals
      },
      {
        title: this.$i18n.t('title.website'),
        detail: `<a href="${this.contract.metadata.website}" target="_BLANK">${this.contract.metadata.website}</a>`
      },
      {
        title: this.$i18n.t('title.support'),
        detail: `<a href="mailto:${this.contract.metadata.support.email}" target="_BLANK">${this.contract.metadata.support.email}</a>`
      },
      {
        title: this.$i18n.t('title.links'),
        detail: Object.entries(this.contract.metadata.social)
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
}
</script>
