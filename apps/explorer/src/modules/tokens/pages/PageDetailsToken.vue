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
      <token-details-list :address-ref="addressRef" :token-details="tokenDetails" :is-loading="loading" :error="error" />
      <app-tabs v-if="!syncing" :tabs="tabsTokenDetails">
        <!--
        =====================================================================================
          TRANSFERS
        =====================================================================================
        -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <transfers-table :address="addressRef" :page-type="'token'" :decimals="decimals" :symbol="symbol" />
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
      <token-details-list :address-ref="addressRef" :token-details="tokenDetails" :holder-details="holderDetails" :is-loading="loading" :error="error" />
      <app-tabs v-if="!syncing" :tabs="tabsTokenHolderDetails">
        <!-- Transfers -->
        <v-tab-item slot="tabs-item" value="tab-0">
          <transfers-table :address="addressRef" :page-type="'tokenHolder'" :decimals="decimals" :holder="holderAddress" :symbol="symbol" />
        </v-tab-item>
        <!-- End Transfers -->
      </app-tabs>
    </div>
  </v-container>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenDetailsList from '@app/modules/tokens/components/TokenDetailsList.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Crumb, Tab } from '@app/core/components/props'
import { tokenDetails, tokenHolderDetails } from '@app/modules/tokens/tokens.graphql'
import BigNumber from 'bignumber.js'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
import TokenTableHolders from '@app/modules/tokens/components/TokenTableHolders.vue'
import TransfersTable from '@app/modules/transfers/components/TransfersTable.vue'
import { TokenHolderExt } from '@app/core/api/apollo/extensions/token-holder.ext'
import { TokenDetailExt } from '@app/core/api/apollo/extensions/token-detail.ext'

const MAX_ITEMS = 10

@Component({
  components: {
    AppBreadCrumbs,
    TokenDetailsList,
    AppTabs,
    TokenTableHolders,
    TransfersTable
  },
  data() {
    return {
      holderAddress: undefined,
      holderDetails: undefined,
      syncing: undefined
    }
  },
  apollo: {
    tokenDetails: {
      query() {
        const self = this as any
        return self.isHolder ? tokenHolderDetails : tokenDetails
      },

      variables() {
        return { address: this.addressRef, holderAddress: this.holderAddress }
      },

      update({ tokenDetails, tokenHolder, totalTransfers }) {
        if (tokenHolder) {
          this.holderDetails = new TokenHolderExt(tokenHolder, totalTransfers)
        }

        if (tokenDetails) {
          return new TokenDetailExt(tokenDetails)
        } else if (!this.syncing) {
          this.error = this.error || this.$i18n.t('message.invalid.token')
        }

        return null
      },

      error({ graphQLErrors, networkError }) {
        const self = this

        if (graphQLErrors) {
          graphQLErrors.forEach(error => {
            switch (error.message) {
              case 'Currently syncing':
                // TODO handle this better with custom code or something
                self.syncing = true
                break
              default:
              // Do nothing
            }
          })
        }
        // TODO refine
        if (networkError) {
          this.error = this.$i18n.t('message.no-data')
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

  tokenDetails?: TokenDetailExt
  holderDetails?: TokenHolderExt
  address = ''

  error = '' // Error string pertaining to the TokenDetailsList component
  syncing?: undefined

  // Holder //
  isHolder = false // Whether or not "holder" is included in query params to display view accordingly
  holderAddress?: string // Address of current token holder, if applicable

  /*
  ===================================================================================
    Lifecycle
  ===================================================================================
  */

  /**
   * Set isHolder and holderAddress if found in route
   */
  async mounted() {
    const query = this.$route.query

    if (query.holder) {
      this.isHolder = true
      this.holderAddress = query.holder as string
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
      this.isHolder = true
      this.holderAddress = query.holder as string
    } else {
      this.isHolder = false
      this.holderAddress = undefined
      this.holderDetails = undefined
    }
    window.scrollTo(0, 0)
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
        text: this.$tc('token.name', 2),
        link: '/tokens'
      },
      {
        text: this.tokenLabel
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
        text: this.$tc('token.name', 2),
        link: '/tokens'
      },
      {
        text: this.tokenLabel,
        link: `/token/${this.addressRef}`
      },
      {
        text: this.$t('token.holder'),
        hash: this.holderAddress,
        link: `/address/${this.holderAddress}`
      }
    ]
  }

  /*
  ===================================================================================
    Computed Values
  ===================================================================================
  */

  get loading(): boolean | undefined {
    return this.$apollo.loading || this.syncing
  }

  get totalSupply(): BigNumber | undefined {
    return this.tokenDetails ? this.tokenDetails.totalSupplyBN : undefined
  }

  get tokenLabel(): string {
    const { tokenDetails } = this
    if (!tokenDetails) {
      return this.tokenLabelDefault
    }

    const { symbol, name } = tokenDetails

    if (symbol) {
      return symbol.toUpperCase()
    } else if (name) {
      return name.toUpperCase()
    }
    return this.tokenLabelDefault
  }

  get tokenLabelDefault(): string {
    const n = this.addressRef.length
    return `${this.$i18n.tc('token.name', 1)}: ${this.addressRef.slice(0, 4)}...${this.addressRef.slice(n - 4, n)}`
  }

  get decimals(): number | null {
    const { tokenDetails } = this
    return tokenDetails ? tokenDetails.decimals : null
  }

  get symbol(): string | null {
      const { tokenDetails } = this
      return tokenDetails ? tokenDetails.symbol : null
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
