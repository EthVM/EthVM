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
      <token-details-list :address-ref="addressRef" :token-details="tokenDetails" :is-loading="isTokenDetailsLoading" :error="errorTokenDetailsList" />
      <app-tabs :tabs="tabsTokenDetails">
        <!--
        =====================================================================================
          TRANSFERS
        =====================================================================================
        -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <transfers-table :address="addressRef" :page-type="'token'" :decimals="decimals" />
        </v-tab-item>
        <!--
        =====================================================================================
          HOLDERS
        =====================================================================================
        -->
        <v-tab-item slot="tabs-item" value="tab-1">
          <token-table-holders :address-ref="addressRef" :total-supply="totalSupply" :decimals="decimals" />
        </v-tab-item>
      </app-tabs>
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
      <app-tabs :tabs="tabsTokenHolderDetails">
        <!-- Transfers -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <transfers-table :address="addressRef" :page-type="'tokenHolder'" :decimals="decimals" :holder="holderAddress" />
        </v-tab-item>
        <!-- End Transfers -->
      </app-tabs>
    </div>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenDetailsList from '@app/modules/tokens/components/TokenDetailsList.vue'
import HolderDetailsList from '@app/modules/tokens/components/HolderDetailsList.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Crumb, Tab } from '@app/core/components/props'
import { tokenDetails } from '@app/modules/tokens/tokens.graphql'
import { TokenExchangeRateDetailExt } from '@app/core/api/apollo/extensions/token-exchange-rate-detail.ext'
import BigNumber from 'bignumber.js'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TokenTableHolders from '@app/modules/tokens/components/TokenTableHolders.vue'
import TransfersTable from '@app/modules/transfers/components/TransfersTable.vue'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    HolderDetailsList,
    TokenDetailsList,
    AppTabs,
    TokenTableHolders,
    TransfersTable
  },
  apollo: {
    tokenDetails: {
      query: tokenDetails,

      variables() {
        return { address: this.addressRef }
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

  errorHolderDetailsList = '' // Error string pertaining to the HolderDetailsList component

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

      const holderDetailsListPromise = this.loadHolderDetailsList()
      const promises = [holderDetailsListPromise]

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
    return false
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

  /**
   * Props object to describe tabs for AppTabs component for Token view
   */
  get tabsTokenDetails(): Tab[] {
    const tabs = [
      {
        id: 0,
        title: 'Transfers',
        isActive: true
      },
      {
        id: 1,
        title: 'Holders',
        isActive: false
      }
    ]
    return tabs
  }

  /**
   * Props object to describe tabs for AppTabs component for Token Holder view
   */
  get tabsTokenHolderDetails(): Tab[] {
    const tabs = [
      {
        id: 0,
        title: 'Transfers',
        isActive: true
      }
    ]
    return tabs
  }
}
</script>
