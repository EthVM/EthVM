<template>
    <div>
        <address-detail :address="addressDetails" :loading="loading" :loading-tokens="loadingTokens" :ether-price="ethPrice" @errorFavorites="emitErrorState" />
    </div>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { exchangeRate } from '@app/modules/addresses/addresses.graphql'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getEthBalance, getContractMeta, getContractTimestamp } from './addressDetails.graphql'
import { getEthBalance_getEthBalance as BalanceType } from './apolloTypes/getEthBalance'
import { getContractMeta_getContractMeta as ContractMeta } from './apolloTypes/getContractMeta'
import { Address } from '@app/modules/address/components/props'
import AddressDetail from '@app/modules/address/components/AddressDetail.vue'
import BN from 'bignumber.js'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { watch } from 'fs'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { excpAddrNotContract } from '@app/apollo/exceptions/errorExceptions'

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
        },
        getContractMeta: {
            query: getContractMeta,
            fetchPolicy: 'cache-first',
            skip() {
                return this.skipContract
            },
            variables() {
                return { hash: this.address }
            },
            update: data => data.getContractMeta,
            result(data) {
                if (data.data && data.data.getContractMeta) {
                    this.emitErrorState(false)
                    this.setContract(true, data.data.getContractMeta)
                    this.getTimestamp(data.data.getContractMeta)
                } else {
                    this.setContract(false)
                }
                this.skipContract = true
            },
            error(error) {
                const newError = JSON.stringify(error.message)

                if (newError.toLowerCase().includes(excpAddrNotContract)) {
                    this.emitErrorState(false)
                    this.setContract(false)
                } else {
                    this.emitErrorState(true, ErrorMessage.contractNotFound)
                }
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
    @Prop(Function) setContract!: void
    @Prop(Function) setContractTimestamp!: (data: number) => void
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    getEthBalance!: BalanceType
    hasError = false
    getContractMeta!: ContractMeta
    skipContract = false

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
    getTimestamp(contract: ContractMeta) {
        this.$apollo
            .query({
                query: getContractTimestamp,
                variables: {
                    hash: contract.transactionHash
                }
            })
            .then(response => {
                if (response.data) {
                    this.setContractTimestamp(response.data.getTransactionByHash.timestamp)
                }
            })
            .catch(error => {
                this.emitErrorState(true, ErrorMessage.contractTimestampNotFound)
            })
    }

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
