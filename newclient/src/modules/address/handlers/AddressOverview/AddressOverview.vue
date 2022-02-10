<template>
    <div>
        <address-detail :address="addressDetails" :loading="loading" :loading-tokens="loadingTokens" :ether-price="ethPrice" @errorFavorites="emitErrorState" />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { getEthBalance } from './addressDetails.graphql'
import { getEthBalance_getEthBalance as BalanceType } from './apolloTypes/getEthBalance'
import { Address } from '@app/modules/address/components/props'
import AddressDetail from '@app/modules/address/components/AddressDetail.vue'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'

@Component({
    components: {
        AddressDetail
    },
    apollo: {
        getEthBalance: {
            query: getEthBalance,
            variables() {
                return { hash: this.address }
            },
            update: data => data.getEthBalance,
            result(data) {
                if (data.data && data.data.getEthBalance) {
                    this.emitErrorState(false)
                }
            },
            error(error) {
                this.emitErrorState(true, ErrorMessage.balance)
            }
        }
    }
})
export default class AddressOverview extends Mixins(CoinData) {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) address!: string
    @Prop(Boolean) isMiner!: boolean
    @Prop(Boolean) isContractCreator!: boolean
    @Prop(Boolean) isContract!: boolean
    @Prop(Number) totalErc20Owned!: number
    @Prop(Boolean) loadingTokens!: boolean
    @Prop(Boolean) updateBalance!: boolean

    /*
    ===================================================================================
      Initial Data
t    ===================================================================================
    */
    getEthBalance!: BalanceType
    hasError = false

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    get addressDetails(): Address {
        return {
            hash: this.address,
            balance: this.getEthBalance ? this.getEthBalance.balance : '0',
            isMiner: this.isMiner,
            isContractCreator: this.isContractCreator,
            totalERC20: this.totalErc20Owned,
            isContract: this.isContract
        }
    }

    get loading(): boolean {
        return this.hasError ? true : this.$apollo.queries.getEthBalance.loading
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */

    /**
     * Emits error to Sentry
     */
    emitErrorState(val: boolean, message: string): void {
        this.hasError = val
        this.$emit('errorAddrOverview', this.hasError, message)
    }

    /*
    ===================================================================================
     Watch
    ===================================================================================
    */
    @Watch('updateBalance')
    onUpdateBalanceChanged(): void {
        if (this.updateBalance && !this.$apollo.queries.getEthBalance.loading) {
            this.$apollo.queries.getEthBalance.refetch()
            this.$emit('resetBalanceUpdate')
        }
    }
}
</script>
