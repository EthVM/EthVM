<template>
  <div>
    <app-details-list
      :title="title"
      :details="details"
      :is-loading="isLoading"
      :error="error"
      class="mb-4"
    >
      <template v-slot:title>
        <v-layout grid-list-xs row align-center justify-start fill-height pa-4>
          <div class="token-image">
            <v-img :src="image" contain />
          </div>
          <v-card-title class="title font-weight-bold pl-1">{{title}}</v-card-title>
        </v-layout>
      </template>
    </app-details-list>
  </div>
</template>

<script lang="ts">
import { Detail } from '@app/core/components/props'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import { StringConcatMixin } from '@app/core/components/mixins'
import { Hex } from '@app/core/models'
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { TokenExchangeRateDetailExt } from '@app/core/api/apollo/extensions/token-exchange-rate-detail.ext'
import { TranslateResult } from 'vue-i18n'
import { defaultCoreCipherList } from 'constants';

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
  @Prop(Object) tokenDetails!: TokenExchangeRateDetailExt
  @Prop(Boolean) isLoading!: boolean
  @Prop(String) error!: string
  @Prop({ type: Boolean, default: false }) hasHolder!: boolean

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
      name = this.tokenDetails.name === null ? name : this.$tc('token.name', 1)
      symbol = this.tokenDetails.symbol === null ? symbol : `(${this.tokenDetails.symbol.toUpperCase()}) `
    }
    if (this.hasHolder) {
      holder = `- ${this.$t('token.filtered')}`
    }

    return `${name} ${symbol} ${holder}`
  }

  get image(): string {
    return !(this.tokenDetails && this.tokenDetails.image) ? require('@/assets/icon-token.png') : this.tokenDetails.image
  }
  /**
   * Properly format the Details[] array for the details table.
   * If the data hasn't been loaded yet, then only include the titles in the details.
   */
  get details(): Detail[] {
    let holderFields: Detail[] = [
      {
        title: this.$t('token.holder')
      },
      {
        title: this.$t('common.balance')
      },
      {
        title: this.$t('usd.total')
      },
      {
        title: this.$t('token.transfers')
      }
    ]
    let detailsContract: Detail[] = [
      {
        title: this.$tc('contract.name', 1)
      },
      {
        title: this.$t('token.owner')
      },
      {
        title: this.$t('token.decimals')
      },
      {
        title: this.$tc('token.type', 1)
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
    let marketFields: Detail[] = [
      {
        title: this.$i18n.tc('price.name', 1)
      },
      {
        title: this.$i18n.t('token.supply')
      },
      {
        title: this.$i18n.t('token.circSupply')
      },
      {
        title: this.$i18n.t('token.market')
      },
      {
        title: this.$i18n.t('token.volume')
      },
      {
        title: this.$i18n.t('token.holder-total')
      }
    ]
    console.log(this.tokenDetails)

    if (!this.isLoading && this.tokenDetails) {
      if (this.tokenDetails.address) {
        Object.assign(detailsContract[0], {
          detail: new Hex(this.tokenDetails.address).toString(),
          link: `/address/${new Hex(this.tokenDetails.address).toString()}`,
          copy: true
        })
      }
      if (this.tokenDetails.contract && this.tokenDetails.contract.creator) {
        Object.assign(detailsContract[1], {
          detail: this.tokenDetails.contract.creator,
          link: `/address/${this.tokenDetails.contract.creator}`,
          copy: true
        })
      }
      if (this.tokenDetails.contract && this.tokenDetails.contract.metadata) {
        let metadata = this.tokenDetails.contract.metadata
        if (metadata.decimals) {
          Object.assign(detailsContract[2], {
            detail: metadata.decimals,
          })
        }

        if (metadata.type) {
          Object.assign(detailsContract[3],{
            detail: metadata.type
          })
        }
        if(metadata.website) {
          Object.assign(detailsContract[4], {
            detail: metadata.website,
            link: `${metadata.website}`
          })
        }
        if(metadata.support){
          Object.assign(detailsContract[5], {
            detail:`<a href="mailto:${metadata.support.email}" target="_BLANK">${metadata.support.email}</a>`
          })
        }
        if(metadata.social) {
          Object.assign(detailsContract[6], {
             detail: Object.entries(metadata.social)
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
          })
        }
      }
    }

    //   // if (this.tokensDetails.)
    //   console.log(this.tokenDetails)

    //     if (this.hasHolder) {

    //     }

    //   const { address, contract, totalSupply, circulatingSupply, currentPrice, marketCap, totalVolume, holdersCount } = this.tokenDetails
    //   const owner = contract ? contract.creator : ''

    //   if (owner) {
    //     details.push({
    //       title: this.$i18n.t('token.owner'),
    //       detail: owner,
    //       link: `/address/${owner}`
    //     })
    //   }

    //   if (totalSupply) {
    //     details.push({
    //       title: this.$i18n.t('token.supply'),
    //       detail: this.formatStr(totalSupply.toString())
    //     })
    //   }

    //   if (circulatingSupply) {
    //     details.push({
    //       title: this.$i18n.t('token.circSupply').toString(),
    //       detail: this.formatStr(circulatingSupply.toString())
    //     })
    //   }

    //   if (currentPrice) {
    //     details.push({
    //       title: this.$i18n.tc('price.name', 1),
    //       detail: `$${currentPrice}`,
    //       priceChange: this.getPriceChange()
    //     })
    //   }

    //   if (marketCap) {
    //     details.push({
    //       title: this.$i18n.t('token.market'),
    //       detail: `$${this.getRoundNumber(marketCap)}`
    //     })
    //   }

    //   if (totalVolume) {
    //     details.push({
    //       title: this.$i18n.t('token.volume').toString(),
    //       detail: `$${this.getInt(totalVolume)}`
    //     })
    //   }

    //   if (holdersCount) {
    //     details.push({
    //       title: this.$i18n.t('token.holder-total'),
    //       detail: holdersCount
    //     })
    //   }

    //   const { metadata } = contract!

    //   if (metadata) {

    //     }

    //     if (metadata.support) {
    //       details.push({
    //         title: this.$i18n.t('token.support'),
    //         detail: `<a href="mailto:${metadata.support.email}" target="_BLANK">${metadata.support.email}</a>`
    //       })
    //     }
    //     if (metadata.type) {
    //       details.push({
    //         title: this.$i18n.t('token.type').toString(),
    //         detail: metadata.type
    //       })
    //     }

    //     if (metadata.social) {
    //       details.push({
    //         title: this.$i18n.t('token.links'),
    //         detail: Object.entries(metadata.social)
    //           .map(obj => {
    //             const name = obj[0]
    //             const url = obj[1]
    //             if (url === null || url === '') {
    //               return ''
    //             }
    //             return `<a href="${url}" target="_BLANK"><i aria-hidden="true" class="v-icon primary--text ${
    //               icons[name]
    //             } pr-2 material-icons theme--light"></i></a>`
    //           })
    //           .reduce((a, b) => {
    //             return `${a}${b}`
    //           })
    //       })
    //     }
    //   }
    // }
    return detailsContract
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
