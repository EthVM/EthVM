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
        :token-details="tokenDetails"
        :is-loading="isTokenDetailsLoading"
        :error="errorTokenDetailsList"
      />
      <token-details-tabs
        :address-ref="addressRef"
        :total-supply="totalSupply"
        :decimals="decimals"
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
        :token-details="tokenDetails"
        :holder-details="holderDetails"
        :is-loading="isHolderDetailsListLoading"
        :error="errorTokenDetailsList"
      />
      <holder-details-tabs
        :address-ref="addressRef"
        :holder-transfers="holderTransfers"
        :total-transfers="totalHolderTransfers"
        :transfers-page="holderTransfersPage"
        :is-holder-transfers-loading="isHolderTransfersLoading"
        :error-holder-transfers="errorHolderTransfers"
        :decimals="decimals"
        @holdersTransfersPage="setPageHolderTransfers"
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
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Crumb } from '@app/core/components/props'
import { TokenHolder, Transfer } from '@app/core/models'
import { tokenDetails } from '@app/modules/tokens/tokens.graphql'
import { TokenExchangeRateDetailExt } from "@app/core/api/apollo/extensions/token-exchange-rate-detail.ext";
import BigNumber from 'bignumber.js'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    HolderDetailsList,
    HolderDetailsTabs,
    TokenDetailsList,
    TokenDetailsTabs
  },
  apollo: {
    tokenDetails: {
      query: tokenDetails,

      variables() {
        return { address: this.addressRef}
      },

      watchLoading(isLoading) {
        if (isLoading) {
          this.error = ''
        } // clear the error on load
      },

      update({ tokenDetails }) {
        if (tokenDetails) {
          return new TokenExchangeRateDetailExt(tokenDetails)
        }

        this.errorTokenDetailsList = this.errorTokenDetailsList || this.$i18n.t('message.invalid.token')
        return null
      },

      error({ graphQLErrors, networkError }) {
        // TODO refine
        if (networkError) {
          this.errorTokenDetailsList = this.$i18n.t('message.no-data')
        }
      }
    }
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

  tokenDetails?: TokenExchangeRateDetailExt
  address = ''

  errorTokenDetailsList = '' // Error string pertaining to the TokenDetailsList component

  // Holder //
  isHolder = false // Whether or not "holder" is included in query params to display view accordingly
  holderAddress: any = '' // Address of current token holder, if applicable
  holderDetails: any = {} // Balance/information for a particular holder address

  holderTransfers: any[] = [] // Transactions for a particular holder address
  totalHolderTransfers: string = '' // Total number of transfers for holder and contract as hex
  holderTransfersPage: number = 0 // Current page of holder transfers

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
      await this.loadHolderData()
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
      this.fetchHolderTransfers()
        .then(({ items, totalCount }) => {
          this.holderTransfers = items
          this.totalHolderTransfers = totalCount
        })
        .catch(e => {
          this.errorHolderTransfers = this.$i18n.t('message.no-history').toString()
        })
    })
  }

  /*
  ===================================================================================
    Methods - Fetch Data - Individual Calls
  ===================================================================================
  */

  /**
   * GET and return JSON object of balances and information for a particular address/token
   *
   * @return {Object} - Information object
   */
  fetchHolderDetails() {
    return new Promise((resolve, reject) => {
      this.$api
        .getHolderDetails(this.addressRef, this.holderAddress)
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

  /**
   * GET and return JSON array of transactions for a particular holder address
   *
   * @return {Array} - Array of transactions
   */
  fetchHolderTransfers(): Promise<{ items: Transfer[]; totalCount: string }> {
    return new Promise((resolve, reject) => {
      this.isHolderTransfersLoading = true

      this.$api
        .getTokenTransfersByContractAddressForHolder(this.addressRef, this.holderAddress, undefined, MAX_ITEMS, this.holderTransfersPage)
        .then(response => {
          this.isHolderTransfersLoading = false
          if (response === null) {
            reject(this.$i18n.t('message.invalidAddress').toString())
          }
          resolve(response)
        })
        .catch(e => {
          this.isHolderTransfersLoading = false
          reject(e)
        })
    })
  }

  setPageHolderTransfers(page: number): void {
    this.holderTransfersPage = page
    this.isHolderTransfersLoading = true
  }

  updateHolderTransfers(): void {
    this.fetchHolderTransfers().then(
      res => {
        this.holderTransfers = res.items
        this.totalHolderTransfers = res.totalCount
        this.isHolderTransfersLoading = false
      },
      err => {
        this.errorHolderTransfers = this.$i18n.t('message.no-data').toString()
      }
    )
  }

  /*
 ===================================================================================
   Watch
 ===================================================================================
 */

  @Watch('holderTransfersPage')
  onHolderTransfersPageChanges(newVal: number, oldVal: number): void {
    this.updateHolderTransfers()
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
        text: 'token.name',
        link: '/tokens',
        disabled: false,
        plural: 2
      },
      {
        text: 'token.name',
        disabled: true,
        plural: 1,
        label: {
          name: this.tokenLabel
        }
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
        text: 'token.name',
        link: '/tokens',
        disabled: false,
        plural: 2
      },
      {
        text: '',
        label: {
          name: this.tokenLabel
        },
        link: `/token/${this.addressRef}`,
        disabled: false
      },
      {
        text: 'token.holder',
        disabled: true,
        label: {
          name: `: ${this.holderAddress}`
        }
      }
    ]
  }

  /*
  ===================================================================================
    Computed Values - isLoading
  ===================================================================================
  */

  /**
   * Determines whether or not the tokenDetails object has been loaded/populated
   *
   * @return {Boolean}
   */
  get isTokenDetailsLoading(): boolean {
    return this.$apollo.queries.tokenDetails.loading
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
   * Determines whether or not all of required objects for the HolderDetailsList component are loaded
   *
   * @return {Boolean}
   */
  get isHolderDetailsListLoading(): boolean {
    return this.isTokenDetailsLoading || this.isHolderDetailsLoading
  }

  get totalSupply(): BigNumber | null {
    return this.tokenDetails ? this.tokenDetails.totalSupplyBN : null
  }

  get tokenLabel(): string {
    return this.tokenDetails && this.tokenDetails.symbol ? this.tokenDetails.symbol!.toUpperCase() : this.addressRef
  }

  get decimals(): number | null {
    const { tokenDetails } = this
    return tokenDetails ? tokenDetails.decimals : null
  }
}
</script>
