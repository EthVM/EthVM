<template>
  <v-container grid-list-lg>
    <!--
    =====================================================================================
      HOLDER DETAILS
    =====================================================================================
    -->

    <div v-if="isHolder">
      <h1>TODO</h1>
    </div>

    <!--
      =====================================================================================
        BASIC DETAILS
      =====================================================================================
    -->
    <div v-else>
      <!-- Loaded -->
      <div v-if="!isLoading">
        <app-bread-crumbs :new-items="crumbs" v-if="!isLoading" />
        <details-list-tokens :contract="contract" :token="token" class="mb-5" />
        <details-tabs-tokens :transfers="temporaryTokenTransfers" :holders="tokenHolders" />
      </div>
      <!-- End Loaded -->
      <!-- Not Loaded -->
      <div v-else>
        <v-layout column align-center justify-center ma-3>
          <v-card-title class="primary--text text-xs-center body-2 pb-4">Loading...</v-card-title>
          <v-icon class="fa fa-spinner fa-pulse fa-4x fa-fw primary--text" large />
        </v-layout>
      </div>
      <!-- End Not Loaded -->
    </div>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import AppSocialLink from '@app/core/components/ui/AppSocialLink.vue'
import DetailsListTokens from '@app/modules/tokens/components/DetailsListTokens.vue'
import DetailsTabsTokens from '@app/modules/tokens/components/DetailsTabsTokens.vue'
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import { Detail } from '@app/core/components/props'
import { Token, Tx } from '@app/core/models'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    DetailsListTokens,
    DetailsTabsTokens
  }
})
export default class PageDetailsToken extends Vue {
  @Prop({ type: String }) addressRef!: string
  address = ''
  contract = {}
  token = {}
  tokenTransfers = []
  tokenHolders = []
  isHolder = false

  /*
  ===================================================================================
    Mounted
  ===================================================================================
  */

  /**
   * TODO: Promise.all()
   */
  async mounted() {
    const query = this.$route.query

    if (query.holder) {
      this.isHolder = true
    }

    try {
      this.address = this.addressRef.replace('0x', '')
      this.contract = await this.fetchContractDetails()
      this.token = await this.fetchTokenDetails()
      this.tokenTransfers = await this.fetchAddressTokensTransfers()
      this.tokenHolders = await this.fetchTopTokenHolders()
    } catch (e) {
      //console.log('e', e)
      // handle error accordingly
    }
  }

  /*
  ===================================================================================
    Methods
  ===================================================================================
  */

  /**
   * Retrieve contract details for a the given token contract address.
   *
   * @return {Object} - Contract details and metadata
   */
  fetchContractDetails() {
    return new Promise((resolve, reject) => {
      return this.$api
        .getContract(this.addressRef)
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  /**
   * Retrieve array of token transfers for a given token contract address.
   *
   * @return {Array} - Array of token transfers
   */
  fetchAddressTokensTransfers(page = 0, limit = MAX_ITEMS) {
    return new Promise((resolve, reject) => {
      return this.$api
        .getAddressTokenTransfers(this.addressRef, limit, page)
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  /**
   * GET and return a JSON details object for a particular token address
   *
   * @return {Array} - Token details
   */
  fetchTokenDetails() {
    return new Promise((resolve, reject) => {
      this.$http
        .get(`http://api.ethplorer.io/getTokenInfo/${this.addressRef}?apiKey=freekey&additional=image`)
        .then(response => {
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * GET and return a JSON array of top holders for a particular token address
   *
   * @return {Array} - Array of holders
   */
  fetchTopTokenHolders() {
    return new Promise((resolve, reject) => {
      this.$http
        .get(`http://api.ethplorer.io/getTopTokenHolders/${this.addressRef}?apiKey=freekey`)
        .then(response => {
          resolve(response.data.holders)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  /**
   * Use txs in Vuex until api returns valid data.
   *
   * @return {Tx[]} - Array of recent transactions
   */
  get temporaryTokenTransfers(): Tx[] {
    return this.$store.getters.txs
  }

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs() {
    return [
      {
        text: this.$i18n.t('title.tokens'),
        link: '/tokens',
        disabled: false
      },
      {
        text: this.token.symbol,
        disabled: false
      }
    ]
  }

  /**
   * Determines whether or not the contract object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isContractLoading(): boolean {
    return Object.keys(this.contract).length === 0
  }

  /**
   * Determines whether or not the token object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isTokenLoading(): boolean {
    return Object.keys(this.token).length === 0
  }

  /**
   * Determines whether or not the transfers object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isTransfersLoading(): boolean {
    return this.temporaryTokenTransfers.length === 0
  }

  /**
   * Determines whether or not the holders object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isHoldersLoading(): boolean {
    return this.tokenHolders.length === 0
  }

  /**
   * Determines whether or not all of the required objects have been loaded/populated
   *
   * @return {Boolean}
   */
  get isLoading(): boolean {
    return this.isContractLoading || this.isTokenLoading || this.isTransfersLoading || this.isHoldersLoading
  }

  /*
  ===================================================================================
    Old
  ===================================================================================
  */

  // // Methods:
  // setDetails(token: Token) {
  //   this.details = [
  //     {
  //       title: this.$i18n.t('token.symbol'),
  //       detail: token.getSymbol()
  //     },
  //     // {
  //     //   title: this.$i18n.t('addrOverview.creator'),
  //     //   detail: token.getContract(),
  //     //   link: '/contract/' + token.getContract()
  //     // },
  //     {
  //       title: this.$i18n.t('token.price'),
  //       detail: token.getPrice(),
  //       copy: true
  //     },
  //     // {
  //     //   title: this.$i18n.t('token.transfers'),
  //     //   detail: token.getTransfers()
  //     // },
  //     {
  //       title: this.$i18n.t('token.decimals'),
  //       detail: token.getDecimals()
  //     }
  //   ]
  //   if (this.holder !== '') {
  //     const holderInfo = [
  //       // {
  //       //   title: this.$i18n.t('token.totalUSD'),
  //       //   details: token.getBalance() * token.getPrice()
  //       // },
  //       // {
  //       //   title: this.$i18n.t('token.balance'),
  //       //   detail: token.getBalance()
  //       // },
  //       {
  //         title: this.$i18n.t('token.holder'),
  //         detail: token.getHolder(),
  //         link: '/address/' + token.getHolder()
  //       }
  //     ]
  //     holderInfo.forEach(i => this.details.unshift(i))
  //   } else {
  //     const tokenInfo = [
  //       {
  //         title: this.$i18n.t('token.totalHold'),
  //         detail: token.getTotalHolders()
  //       },
  //       {
  //         title: this.$i18n.t('token.supply'),
  //         detail: token.getTotalSupply()
  //       }
  //     ]
  //     tokenInfo.forEach(i => this.details.push(i))
  //   }
  // }
}
</script>
