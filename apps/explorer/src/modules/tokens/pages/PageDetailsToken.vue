<template>
  <v-container grid-list-lg>
    <app-bread-crumbs :new-items="crumbs" />
    <!--
    =====================================================================================
      BASIC VIEW

      Will show details if URL does NOT include query param "holder"
      Shows details pertinent to the token as a whole, with no holder-specific information
    =====================================================================================
    -->
    <div v-if="!isHolder">
      <token-details-list
        :address-ref="addressRef"
        :contract-details="contractDetails"
        :token-details="tokenDetails"
        :is-loading="isTokenDetailsListLoading"
        :error="errorTokenDetailsList"
      />
      <token-details-tabs
        :address-ref="addressRef"
        :token-transfers="tokenTransfers"
        :token-holders="tokenHolders"
        :is-token-transfers-loading="isTokenTransfersLoading"
        :is-token-holders-loading="isTokenHoldersLoading"
        :error-token-transfers="errorTokenTransfersTab"
        :error-token-holders="errorTokenHoldersTab"
      />
    </div>
    <!--
    =====================================================================================
      HOLDER VIEW

      Will show details if the URL DOES include query param "holder"
      Shows holder details pertaining to particular token contract
    =====================================================================================
    -->
    <div v-if="isHolder">
      <holder-details-list
        :address-ref="addressRef"
        :contract-details="contractDetails"
        :token-details="tokenDetails"
        :holder-details="holderDetails"
        :is-loading="isHolderDetailsListLoading"
        :error="errorTokenDetailsList"
      />
      <holder-details-tabs
        :address-ref="addressRef"
        :holder-transfers="holderTransfers"
        :is-holder-transfers-loading="isHolderTransfersLoading"
        :error-holder-transfers="errorHolderTransfers"
      />
    </div>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenDetailsList from '@app/modules/tokens/components/TokenDetailsList.vue'
import TokenDetailsTabs from '@app/modules/tokens/components/TokenDetailsTabs.vue'
import HolderDetailsList from '@app/modules/tokens/components/HolderDetailsList.vue'
import HolderDetailsTabs from '@app/modules/tokens/components/HolderDetailsTabs.vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Events } from 'ethvm-common'
import { Detail, Crumb } from '@app/core/components/props'
import { Token, Tx } from '@app/core/models'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    TokenDetailsList,
    TokenDetailsTabs,
    HolderDetailsList,
    HolderDetailsTabs
  }
})
export default class PageDetailsToken extends Vue {
  /*
  ===================================================================================
    Props
  ===================================================================================
  */

  @Prop({ type: String }) addressRef!: string

  /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

  address = '' // TEMP: Formatted address with "0x" removed from beginning

  // Basic //
  contractDetails: any = {} // Contract details object
  tokenDetails: any = {} // Token details object
  tokenTransfers: any[] = [] // Array of token transfers
  tokenHolders: any[] = [] // Array of token holders
  isTokenTransfersLoading = true // Can technically be empty array, so must be manually set
  isTokenHoldersLoading = true // Can technically be empty array, so must be manually set
  errorTokenDetailsList = '' // Error string pertaining to the TokenDetailsList component
  errorTokenTransfersTab = '' // Error string pertaining to the TokenDetailsTabs -> Transfers component
  errorTokenHoldersTab = '' // Error string pertaining to the TokenDetailsTabs -> Holders component

  // Holder //
  isHolder = false // Whether or not "holder" is included in query params to display view accordingly
  holderAddress: any = '' // Address of current token holder, if applicable
  holderDetails: any = {} // Balance/information for a particular holder address
  holderTransfers: any[] = [] // Transactions for a particular holder address
  isHolderTransfersLoading = true // Can technically be empty array, so must be manually set
  errorHolderDetailsList = '' // Error string pertaining to the HolderDetailsList component
  errorHolderTransfers = '' // Error string pertaining to the HolderDetailsTabs component

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  /**
   * Fetch all data relevant to the view.
   * Additional data will be loaded/displayed if "holder" is included in the query parameters.
   * Data is loaded in an async/await fashion for proper error handling.
   */
  async mounted() {
    const query = this.$route.query

    if (query.holder) {
      this.isHolder = true
      await this.loadBasicData()
      await this.loadHolderData()
    } else {
      await this.loadBasicData()
    }
  }

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  /**
   * Watch $route/parameter changes.
   * If route updates with query param "holder", then fetch additional information
   * for that holder address.
   */
  @Watch('$route', { deep: true })
  onRouteChange() {
    const query = this.$route.query
    if (query.holder) {
      this.loadHolderData()
    } else {
      this.isHolder = false
      this.holderAddress = ''
      this.holderDetails = {}
      this.holderTransfers = []
      this.isHolderTransfersLoading = false
    }
    window.scrollTo(0, 0)
  }

  /*
  ===================================================================================
    Methods - Load Data - Basic View
  ===================================================================================
  */

  /**
   * Perform each method to load data required for every "basic view" component
   */
  loadBasicData() {
    return new Promise((resolve, reject) => {
      const tokenDetailsListPromise = this.loadTokenDetailsList()
      const tokenDetailsTabsTransfersPromise = this.loadTokenDetailsTabsTransfers()
      const tokenDetailsTabsHoldersPromise = this.loadTokenDetailsTabsHolders()
      const promises = [tokenDetailsListPromise, tokenDetailsTabsTransfersPromise, tokenDetailsTabsHoldersPromise]

      Promise.all(promises).then(resolve)
    })
  }

  /**
   * Load all data required and handle errors for TokenDetailsList component
   */
  loadTokenDetailsList() {
    return new Promise((resolve, reject) => {
      const contractDetailsPromise = this.fetchContractDetails()
      const tokenDetailsPromise = this.fetchTokenDetails()
      const promises = [contractDetailsPromise, tokenDetailsPromise]

      Promise.all(promises)
        .then(([contractDetails, tokenDetails]) => {
          this.contractDetails = contractDetails as any
          this.tokenDetails = tokenDetails as any
          resolve()
        })
        .catch(e => {
          this.errorTokenDetailsList = this.$i18n.t('message.invalidToken').toString()
          resolve()
        })
    })
  }

  /**
   * Load all data required and handle errors for the TokenDetailsTabs -> Transfers component
   */
  loadTokenDetailsTabsTransfers() {
    return new Promise((resolve, reject) => {
      const tokenTransfersPromise = this.fetchTokenTransfers()
      const promises = [tokenTransfersPromise]

      Promise.all(promises)
        .then(([tokenTransfers]) => {
          this.tokenTransfers = tokenTransfers as any[]
          resolve()
        })
        .catch(e => {
          this.errorTokenTransfersTab = '' // 0 transfers is not an 'error'
          resolve()
        })
    })
  }

  /**
   * Load all data required and handle errors for the TokenDetailsTabs -> Holders component
   */
  loadTokenDetailsTabsHolders() {
    return new Promise((resolve, reject) => {
      const tokenHoldersPromise = this.fetchTokenHolders()

      Promise.all([tokenHoldersPromise])
        .then(([tokenHolders]) => {
          this.tokenHolders = tokenHolders as any[]
          resolve()
        })
        .catch(e => {
          this.errorTokenHoldersTab = '' // 0 holders is not an 'error'
          resolve()
        })
    })
  }

  /*
  ===================================================================================
    Methods - Fetch Data - Holder View
  ===================================================================================
  */

  /**
   * Load additional data required for a "holder view" load
   */
  loadHolderData() {
    return new Promise((resolve, reject) => {
      const query = this.$route.query
      this.isHolder = true
      this.holderAddress = query.holder
      this.holderDetails = {}
      this.holderTransfers = []
      this.isHolderTransfersLoading = true

      const holderDetailsListPromise = this.loadHolderDetailsList()
      const holderDetailsTabsTransactionsPromise = this.loadHolderDetailsTabsTransactions()
      const promises = [holderDetailsListPromise, holderDetailsTabsTransactionsPromise]

      Promise.all(promises).then(resolve)
    })
  }

  /**
   * Load all data required and handle errors for the HolderDetailsList component
   */
  loadHolderDetailsList() {
    return new Promise((resolve, reject) => {
      const holderDetailsPromise = this.fetchHolderDetails()

      Promise.all([holderDetailsPromise])
        .then(([holderDetails]) => {
          this.holderDetails = holderDetails as any
        })
        .catch(e => {
          this.errorHolderDetailsList = '' // Any address can be "legitimate" just might not have details
        })
    })
  }

  /**
   * Load all data required and handle errors for the HolderDetailsTabs -> Transactions component
   */
  loadHolderDetailsTabsTransactions() {
    return new Promise((resolve, reject) => {
      const holderTransfersPromise = this.fetchHolderTransfers()

      Promise.all([holderTransfersPromise])
        .then(([holderTransfers]) => {
          this.holderTransfers = holderTransfers as any[]
        })
        .catch(e => {
          this.errorHolderTransfers = this.$i18n.t('message.noTxHistory').toString()
        })
    })
  }

  /*
  ===================================================================================
    Methods - Fetch Data - Individual Calls
  ===================================================================================
  */

  /**
   * Retrieve contract details for a the given token contract address.
   *
   * @return {Object} - Contract details and metadata
   */
  fetchContractDetails() {
    return this.$api.getContract(this.addressRef)
  }

  /**
   * GET and return a JSON details object for a particular token address
   *
   * @return {Array} - Token details
   */
  fetchTokenDetails() {
    return new Promise((resolve, reject) => {
      this.$api
        .getTokenExchangeRateByAddress(this.addressRef)
        .then(response => {
          if (response === null) {
            reject(this.$i18n.t('message.invalidAddress').toString())
          }
          resolve(response)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  // /**
  //  * Retrieve array of token transfers for a given token contract address.
  //  *
  //  * @return {Array} - Array of token transfers
  //  */
  // fetchTokenTransfers(page = 0, limit = MAX_ITEMS) {
  //   return new Promise((resolve, reject) => {
  //     this.$api
  //       .getAddressTokenTransfers(this.addressRef, limit, page)
  //       .then(result => {
  //         resolve(result)
  //       })
  //       .catch(e => {
  //         reject(e)
  //       })
  //   })
  // }

  /**
   * Fetch latest [10] token transfers for a particular token contract
   *
   * @return {Array} - Array of token transfers/info
   */
  fetchTokenTransfers() {
    return new Promise((resolve, reject) => {
      this.isTokenTransfersLoading = true
      this.$http
        .get(`http://api.ethplorer.io/getTokenHistory/${this.addressRef}?apiKey=freekey&type=transfer&limit=10`)
        .then(response => {
          this.isTokenTransfersLoading = false
          if (response.data.error) {
            return reject(response.data.error.message)
          }
          resolve(response.data.operations)
        })
        .catch(err => {
          this.isTokenTransfersLoading = false
          reject(err)
        })
    })
  }

  /**
   * GET and return a JSON array of top holders for a particular token address
   *
   * @return {Array} - Array of holders
   */
  fetchTokenHolders() {
    return new Promise((resolve, reject) => {
      this.isTokenHoldersLoading = true
      this.$http
        .get(`http://api.ethplorer.io/getTopTokenHolders/${this.addressRef}?apiKey=freekey`)
        .then(response => {
          this.isTokenHoldersLoading = false
          if (response.data.error) {
            return reject(response.data.error.message)
          }
          resolve(response.data.holders)
        })
        .catch(err => {
          this.isTokenHoldersLoading = false
          reject(err)
        })
    })
  }

  /**
   * GET and return JSON object of balances and information for a particular address/token
   *
   * @return {Object} - Information object
   */
  fetchHolderDetails() {
    return new Promise((resolve, reject) => {
      this.$http
        .get(`http://api.ethplorer.io/getAddressInfo/${this.holderAddress}?apiKey=freekey&token=${this.addressRef}`)
        .then(response => {
          if (response.data.error) {
            return reject(response.data.error.message)
          }
          resolve(response.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  /**
   * GET and return JSON array of transactions for a particular holder address
   *
   * @return {Array} - Array of transactions
   */
  fetchHolderTransfers() {
    return new Promise((resolve, reject) => {
      this.isHolderTransfersLoading = true
      this.$http
        .get(`http://api.ethplorer.io/getAddressHistory/${this.holderAddress}?apiKey=freekey&token=${this.addressRef}&type=transfer`)
        .then(response => {
          this.isHolderTransfersLoading = false
          if (response.data.error) {
            return reject(response.data.error.message)
          }
          resolve(response.data.operations)
        })
        .catch(err => {
          this.isHolderTransfersLoading = false
          reject(err)
        })
    })
  }

  /*
  ===================================================================================
    Computed Values - Crumbs
  ===================================================================================
  */

  /**
   * Returns breadcrumbs entry for this particular view.
   * Required for AppBreadCrumbs
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbs(): Crumb[] {
    return this.isHolder ? this.crumbsHolder : this.crumbsBasic
  }

  /**
   * Returns breadcrumbs for "holder" view
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbsBasic(): Crumb[] {
    return [
      {
        text: this.$i18n.t('title.tokens'),
        link: '/tokens',
        disabled: false
      },
      {
        text: this.isTokenDetailsLoading ? this.addressRef : this.tokenDetails.symbol.toUpperCase(),
        link: `/token/${this.addressRef}`,
        disabled: true
      }
    ]
  }

  /**
   * Returns breadcrumbs for "basic" view
   *
   * @return {Array} - Breadcrumb entry. See description.
   */
  get crumbsHolder(): Crumb[] {
    return [
      {
        text: this.$i18n.t('title.tokens').toString(),
        link: '/tokens',
        disabled: false
      },
      {
        text: this.isTokenDetailsLoading ? this.addressRef : this.tokenDetails.symbol.toUpperCase(),
        link: `/token/${this.addressRef}`,
        disabled: false
      },
      {
        text: this.holderAddress,
        link: '',
        disabled: true
      }
    ]
  }

  /*
  ===================================================================================
    Computed Values - isLoading
  ===================================================================================
  */

  /**
   * Determines whether or not the contractDetails object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isContractDetailsLoading(): boolean {
    return Object.keys(this.contractDetails).length === 0
  }

  /**
   * Determines whether or not the tokenDetails object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isTokenDetailsLoading(): boolean {
    return Object.keys(this.tokenDetails).length === 0
  }

  /**
   * Determines whether or not the holderDetails object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isHolderDetailsLoading(): boolean {
    return Object.keys(this.holderDetails).length === 0
  }

  /**
   * Determines whether or not all of the required objects for the TokenDetailsList component are loaded
   *
   * @return {Boolean}
   */
  get isTokenDetailsListLoading(): boolean {
    return this.isContractDetailsLoading || this.isTokenDetailsLoading
  }

  /**
   * Determines whether or not all of required objects for the HolderDetailsList component are loaded
   *
   * @return {Boolean}
   */
  get isHolderDetailsListLoading(): boolean {
    return this.isTokenDetailsListLoading || this.isHolderDetailsLoading
  }
}
</script>
