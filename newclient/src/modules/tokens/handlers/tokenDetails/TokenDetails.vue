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
            <token-details-list :address-ref="addressRef" :token-details="tokenDetails" :is-loading="loading" />
            <app-tabs v-if="!loading" :tabs="tabsTokenDetails">
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
                    <token-table-holders :address-ref="addressRef" :decimals="decimals" />
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
            <token-details-list :address-ref="addressRef" :holder-details="tokenDetails" :token-details="tokenDetails.tokenInfo" :is-loading="loading" />
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
import TokenTableHolders from '@app/modules/tokens/components/TokenDetailsHolder/TokenTableHolders.vue'
import TransfersTable from '@app/modules/tokens/components/Transfers/TransfersTable.vue'
import { getTokenInfoByContract, getERC20TokenBalance } from '@app/modules/tokens/handlers/tokenDetails/tokenDetails.graphql'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from './apolloTypes/ERC20TokenOwnerDetails'
import { TokenDetails as TokenInfo } from './apolloTypes/TokenDetails'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        TokenDetailsList,
        AppTabs,
        TokenTableHolders,
        TransfersTable
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

    tokenDetails!: TokenInfo | TokenOwnerInfo
    address = ''

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
        return this.$apollo.loading
    }

    get totalSupply(): BigNumber | undefined {
        return this.tokenDetails['tokenInfo'] ? this.tokenDetails['tokenInfo'].totalSupply : this.tokenDetails['totalSupply']
    }

    get tokenLabel(): string {
        if (!this.tokenDetails) {
            return this.tokenLabelDefault
        }
        if (this.symbol) {
            return this.symbol.toUpperCase()
        } else if (this.name) {
            return this.name.toUpperCase()
        }
        return this.tokenLabelDefault
    }

    get tokenLabelDefault(): string {
        const n = this.addressRef.length
        return `${this.$i18n.tc('token.name', 1)}: ${this.addressRef.slice(0, 4)}...${this.addressRef.slice(n - 4, n)}`
    }

    get decimals(): number | null {
        return this.tokenDetails['tokenInfo'] ? this.tokenDetails['tokenInfo'].decimals : this.tokenDetails['decimals']
    }

    get symbol(): string | null {
        return this.tokenDetails['tokenInfo'] ? this.tokenDetails['tokenInfo'].symbol : this.tokenDetails['symbol']
    }

    get name(): string | null {
        return this.tokenDetails['tokenInfo'] ? this.tokenDetails['tokenInfo'].name : this.tokenDetails['name']
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
