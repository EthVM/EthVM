<template>
  <div>
    <app-details-list :title="title" :details="details" :is-loading="isLoading" :error="error" class="mb-4">
      <template v-slot:title>
        <v-layout grid-list-xs row align-center justify-start fill-height pa-4>
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
import { StringConcatMixin } from '@app/core/components/mixins'
import { Hex } from '@app/core/models'
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { TokenDetailExt } from '@app/core/api/apollo/extensions/token-detail.ext'
import { TokenHolderExt } from '@app/core/api/apollo/extensions/token-holder.ext'
import BN from 'bignumber.js'

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
    console.log(this.tokenDetails)
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
    const detailsHolder: Detail[] = [
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
        title: this.$i18n.t('token.website')
      },
      {
        title: this.$i18n.t('token.support')
      },
      {
        title: this.$i18n.t('token.links')
      }
    ]

    if (!this.isLoading && this.tokenDetails) {
      if (this.tokenDetails.address) {
        Object.assign(detailsContract[0], {
          detail: new Hex(this.tokenDetails.address).toString(),
          link: `/address/${new Hex(this.tokenDetails.address).toString()}`,
          copy: true
        })
      }
      if (this.tokenDetails.owner) {
        Object.assign(detailsContract[1], {
          detail: this.tokenDetails.owner,
          link: `/address/${this.tokenDetails.owner}`,
          copy: true
        })
      }
      if (this.tokenDetails.decimals !== null) {
        Object.assign(detailsContract[2], {
          detail: this.tokenDetails.decimals
        })
      }

      if (this.tokenDetails.contractType) {
        Object.assign(detailsContract[3], {
          detail: this.tokenDetails.contractType
        })
      }
      if (this.tokenDetails.website) {
        Object.assign(detailsContract[9], {
          detail: this.tokenDetails.website,
          link: `${this.tokenDetails.website}`
        })
      }
      if (this.tokenDetails.email) {
        Object.assign(detailsContract[10], {
          detail: `<a href="mailto:${this.tokenDetails.email}" target="_BLANK">${this.tokenDetails.email}</a>`
        })
      }
      if (this.tokenDetails.social) {
        Object.assign(detailsContract[11], {
          detail: Object.entries(this.tokenDetails.social)
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

      Object.assign(detailsContract[4], {
        detail: this.tokenDetails.currentPriceBN ? this.getRoundNumber(this.tokenDetails.currentPriceBN) : '0.00',
        priceChange: this.getPriceChange()
      })

      if (this.tokenDetails.totalSupply) {
        Object.assign(detailsContract[5], {
          detail: this.formatStr(this.tokenDetails.totalSupply.toString())
        })
      }

      if (this.tokenDetails.circulatingSupply) {
        Object.assign(detailsContract[6], {
          detail: this.formatStr(this.tokenDetails.circulatingSupply.toString())
        })
      }

      if (this.tokenDetails.marketCap) {
        Object.assign(detailsContract[7], {
          detail: `$${this.getRoundNumber(this.tokenDetails.marketCap)}`
        })
      }

      if (this.tokenDetails.totalVolume) {
        Object.assign(detailsContract[8], {
          detail: `$${this.getInt(this.tokenDetails.totalVolume)}`
        })
      }

      if (this.holderDetails && this.holderDetails.address) {
        let symbol = this.tokenDetails.symbol === null ? '': ` ${this.tokenDetails.symbol.toUpperCase()}`

        Object.assign(detailsHolder[0], {
          detail: this.holderDetails.address,
          link: `/address/${this.holderDetails.address}`,
          copy: true
        })

        Object.assign(detailsHolder[1], {
          detail: `${this.balance}${symbol}`
        })

        Object.assign(detailsHolder[2], {
          detail: this.balanceUsd
        })

        detailsContract = detailsHolder.concat(detailsContract)
      } else {
        detailsContract.splice(4, 0, {
          title: this.$i18n.t('token.holder-total'),
          detail: this.tokenDetails.holdersCount || 0
        })
      }
    }
    return detailsContract
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

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  getPriceChange(): string {
    if (this.tokenDetails.currentPrice) {
      return this.tokenDetails.priceChangePercentage24h > 0
        ? `+${this.getPercent(this.tokenDetails.priceChangePercentage24h)}`
        : this.getPercent(this.tokenDetails.priceChangePercentage24h)
    }
    return ''
  }
}
</script>
