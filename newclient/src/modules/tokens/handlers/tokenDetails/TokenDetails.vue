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
            <token-details-list
                :holder-details="null"
                :address-ref="addressRef"
                :token-details="tokenDetails"
                :is-nft="isNft"
                :is-loading="loading || hasError"
                @errorDetails="emitErrorState"
            />
            <app-tabs v-if="!loading" :tabs="tabsTokenDetails">
                <!--
        =====================================================================================
          TRANSFERS
        =====================================================================================
        -->
                <v-tab-item slot="tabs-item" value="tab-0">
                    <token-transfers :address="addressRef" :page-type="'token'" :decimals="decimals" :symbol="symbol" @errorDetails="emitErrorState" />
                </v-tab-item>
                <!--
        =====================================================================================
          HOLDERS
        =====================================================================================
        -->
                <v-tab-item slot="tabs-item" value="tab-1">
                    <token-holders :address-ref="addressRef" :decimals="decimals" @errorDetails="emitErrorState" @isNft="getTokenType" />
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
            <token-details-list
                :address-ref="addressRef"
                :holder-details="tokenDetails"
                :token-details="tokenDetails ? tokenDetails['tokenInfo'] : {}"
                :is-loading="loading || hasError"
                @errorDetails="emitErrorState"
            />
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
import TokenHolders from '@app/modules/tokens/handlers/tokenHolders/TokenHolders.vue'
import TokenTransfers from '@app/modules/tokens/handlers/tokenTransfers/TokenTransfers.vue'
import { getTokenInfoByContract, getERC20TokenBalance } from '@app/modules/tokens/handlers/tokenDetails/tokenDetails.graphql'
import { ERC20TokenOwnerDetails as TokenOwnerInfo } from './apolloTypes/ERC20TokenOwnerDetails'
import { TokenDetails as TokenInfo } from './apolloTypes/TokenDetails'
import { eth } from '@app/core/helper'
import { ErrorMessageToken } from '@app/modules/tokens/models/ErrorMessagesForTokens'

const MAX_ITEMS = 10

@Component({
    components: {
        AppBreadCrumbs,
        TokenDetailsList,
        AppTabs,
        TokenHolders,
        TokenTransfers
    },
    apollo: {
        tokenDetails: {
            query() {
                return this.isHolder ? getERC20TokenBalance : getTokenInfoByContract
            },
            variables() {
                return { contract: this.addressRef, owner: this.holderAddress }
            },
            update: data => data.getERC20TokenBalance || data.getTokenInfoByContract,
            result({ data }) {
                if (data && (data.getERC20TokenBalance || data.getTokenInfoByContract)) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                const newError = JSON.stringify(error.message)
                if (newError.includes('Token not found')) {
                    this.emitErrorState(true, ErrorMessageToken.notFound)
                } else {
                    this.emitErrorState(true, ErrorMessageToken.details)
                }
            }
        }
    }
})
export default class TokenDetails extends Vue {
    /*
    ===================================================================================
      LifeCycle
    ===================================================================================
    */

    created() {
        if (!this.isValid) {
            this.hasError = true
            this.emitErrorState(true, ErrorMessageToken.invalid)
            return
        }
        window.scrollTo(0, 0)
    }
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
    hasError = false
    isNft = true

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
                text: this.$tc('token.holder', 1),
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
    get isValid(): boolean {
        return eth.isValidAddress(this.addressRef)
    }

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
                title: this.$tc('transfer.name', 2),
                isActive: true
            },
            {
                id: 1,
                title: this.$tc('token.holder', 2),
                isActive: false
            }
        ]
        return tabs
    }

    /*
  ===================================================================================
    Methods:
  ===================================================================================
  */
    /**
     * Sets error messages if any
     * @param hasError {Boolean}
     * @param message {ErrorMessageBlock}
     */
    emitErrorState(val: boolean, message: ErrorMessageToken): void {
        this.hasError = val
        this.$emit('errorDetails', this.hasError, message)
    }

    getTokenType(val: boolean) {
        this.isNft = val
    }
}
</script>
