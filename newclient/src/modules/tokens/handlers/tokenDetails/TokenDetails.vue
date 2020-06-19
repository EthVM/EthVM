<template>
    <div>
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
            <app-tabs v-if="!loading" :tabs="tabsTokenDetails">
                <!--
        =====================================================================================
          TRANSFERS
        =====================================================================================
        -->
                <!-- <v-tab-item slot="tabs-item" value="tab-0">
                    <transfers-table :address="addressRef" :page-type="'token'" :decimals="decimals" :symbol="symbol" />
                </v-tab-item> -->
                <!--
        =====================================================================================
          HOLDERS
        =====================================================================================
        -->
                <!-- <v-tab-item slot="tabs-item" value="tab-1">
                    <token-table-holders :address-ref="addressRef" :decimals="decimals" />
                </v-tab-item> -->
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
            <token-details-list
                :address-ref="addressRef"
                :holder-details="tokenDetails"
                :token-details="isHolder && tokenDetails ? tokenDetails.tokenInfo : tokenDetails"
                :is-loading="loading"
                :error="error"
            />
            <app-tabs :tabs="tabsTokenHolderDetails">
                <!-- Transfers -->
                <v-tab-item slot="tabs-item" value="tab-0">
                    <!-- <transfers-table :address="addressRef" :page-type="'tokenHolder'" :decimals="decimals" :holder="holderAddress" :symbol="symbol" /> -->
                </v-tab-item>
                <!-- End Transfers -->
            </app-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import AppBreadCrumbs from '@app/core/components/ui/AppBreadCrumbs.vue'
import TokenDetailsList from '@app/modules/tokens/components/TokenDetails/TokenDetailsList.vue'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Crumb, Tab } from '@app/core/components/props'
import BigNumber from 'bignumber.js'
import AppTabs from '@app/core/components/ui/AppTabs.vue'
// import TokenTableHolders from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHolders.vue'
// import TransfersTable from '@app/modules/tokens/components/Transfers/TransfersTable.vue'
import { getTokenInfoByContract, getERC20TokenBalance } from '@app/modules/tokens/handlers/tokenDetails/tokenDetails.graphql'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/ERC20TokenOwnerDetails.ts'
import { TokenDetails as TokenInfo } from '@app/modules/tokens/handlers/tokenDetails/apolloTypes/TokenDetails'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        TokenDetailsList,
        AppTabs
        // TokenTableHolders,
        // TransfersTable
    },
    apollo: {
        tokenDetails: {
            query() {
                return this.isHolder ? getERC20TokenBalance : getTokenInfoByContract
            },

            variables() {
                return { contract: this.addressRef, owner: this.holderAddress }
            },

            update: data => data.getERC20TokenBalance || data.getTokenInfoByContract
        }
    }
})
export default class TokenDetails extends Vue {
    /*
  ===================================================================================
    Props
  ===================================================================================
  */

    @Prop({ type: String }) addressRef!: string
    @Prop({ type: Boolean }) isHolder!: boolean
    @Prop({ type: String }) holderAddress!: string

    /*
  ===================================================================================
    Initial Data
  ===================================================================================
  */

    tokenDetails?: TokenInfo | TokenOwnerInfo
    address = ''

    error = '' // Error string pertaining to the TokenDetailsList components

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
        console.error('dafadf', this.tokenDetails)
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
        return this.$apollo.loading
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
