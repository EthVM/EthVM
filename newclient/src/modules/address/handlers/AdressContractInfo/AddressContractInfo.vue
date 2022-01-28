<template>
    <div class="pa-2">
        <div class="contract-layout mb-3">
            <v-expansion-panel v-model="panel" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">Overview</p>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsOverview" class=""> </app-details-list>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>

        <div class="contract-layout mb-3">
            <v-expansion-panel v-model="panel" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">{{ $t('contract.source-code') }}</p>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsSource" />
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'

// import { exchangeRate } from '@app/modules/addresses/addresses.graphql'
import { FormattedNumber } from '@app/core/helper/number-format-helper'
import { NumberFormatMixin } from '@app/core/components/mixins/number-format.mixin'
import { getContractMeta1, getContractTimestamp1, getContractInput, getContractConfigs } from './addressContractInfo.graphql'
import { getContractMeta1_getContractMeta as ContractMeta } from './apolloTypes/getContractMeta1'

import { Address } from '@app/modules/address/components/props'
// import AddressDetail from '@app/modules/address/components/AddressDetail.vue'
import BN from 'bignumber.js'
import { CoinData } from '@app/core/components/mixins/CoinData/CoinData.mixin'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { excpAddrNotContract } from '@app/apollo/exceptions/errorExceptions'
import { Detail, Crumb, Tab } from '@app/core/components/props'

@Component({
    components: {
        // AddressDetail,
        AppDetailsList
    },
    apollo: {
        getContractMeta: {
            query: getContractMeta1,
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
                    // this.setContract(true, data.data.getContractMeta)
                    this.getTimestamp(data.data.getContractMeta)
                    this.getInput()
                    this.getConfigs()
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
export default class AddressOverview extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) address!: string

    // @Prop(Number) totalErc20Owned!: number
    // @Prop(Boolean) loadingTokens!: boolean
    // @Prop(Boolean) updateBalance!: boolean
    @Prop(Function) setContract!: void
    // @Prop(Function) setContractTimestamp!: (data: number) => void
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    hasError = false
    getContractMeta!: ContractMeta
    skipContract = false
    // isLoadingDetails = true
    isLoadingConfigs = true
    isLoadingInput = true
    isLoadingTimestamp = true
    timestampRaw: number | null = null
    input!: any
    configs!: any
    isVerified = false

    panel = 0
    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    get detailsOverview(): Detail[] {
        let details: Detail[] = []
        if (this.isLoadingDetails || this.isLoadingConfigs) {
            details = [
                {
                    title: this.$i18n.t('contract.date-created')
                },
                {
                    title: this.$i18n.t('contract.tx-hash')
                },
                {
                    title: this.$i18n.t('contract.creator')
                },
                {
                    title: this.$i18n.t('contract.code-hash')
                }
            ]
        } else {
            details = [
                {
                    title: this.$i18n.t('contract.date-created'),
                    detail: this.timestamp
                },
                {
                    title: this.$i18n.t('contract.tx-hash'),
                    detail: this.getContractMeta.transactionHash,
                    link: `/tx/${this.getContractMeta.transactionHash}`,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('contract.creator'),
                    detail: this.getContractMeta.creator,
                    link: `/address/${this.getContractMeta.creator}`,
                    copy: true,
                    mono: true,
                    toChecksum: true
                },
                {
                    title: this.$i18n.t('contract.code-hash'),
                    detail: this.getContractMeta.codeHash,
                    copy: true,
                    mono: true
                }
            ]
            if (this.isVerified && this.configs.name) {
                details.unshift({
                    title: this.$i18n.t('common.name'),
                    detail: this.configs.name
                })
            }
        }
        return details
    }

    get detailsSource(): Detail[] {
        let details: Detail[] = []
        if (this.isLoadingInput || this.isLoadingConfigs) {
            details = [
                {
                    title: this.$i18n.t('contract.language')
                },
                {
                    title: this.$i18n.t('contract.compiler')
                },
                // {
                //     title: this.$i18n.t('contract.constructor-bytes')
                // },
                {
                    title: this.$i18n.t('contract.evm-version')
                },
                {
                    title: this.$i18n.t('contract.code-hash')
                },
                {
                    title: this.$i18n.t('contract.optimization')
                }
            ]
        } else {
            details = [
                {
                    title: this.$i18n.t('contract.language'),
                    detail: this.input.language
                },
                {
                    title: this.$i18n.t('contract.compiler'),
                    detail: this.configs.compiler
                },
                {
                    title: this.$i18n.t('contract.optimization'),
                    detail: this.configs.optimization
                        ? this.$i18n.t('contract.optimization-true', { runs: this.configs.runs })
                        : this.$i18n.t('contract.optimization-false')
                },
                {
                    title: this.$i18n.t('contract.constructor-bytes'),
                    detail: this.configs.constructorBytes
                },
                {
                    title: this.$i18n.t('contract.evm-version'),
                    detail: this.configs.evmVersion
                }
                // {
                //     title: this.$i18n.t('contract.code-hash'),
                //     detail: this.configs.codeHash
                // }
            ]
        }
        return details
    }
    get timestamp(): string {
        return this.timestampRaw ? new Date(this.timestampRaw * 1e3).toString() : ''
    }

    get isLoadingDetails(): boolean {
        return this.$apollo.queries.getContractMeta.loading
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
                query: getContractTimestamp1,
                variables: {
                    hash: contract.transactionHash
                }
            })
            .then(response => {
                if (response.data) {
                    this.timestampRaw = response.data.getTransactionByHash.timestamp
                    this.isLoadingTimestamp = false
                }
            })
            .catch(error => {
                this.emitErrorState(true, ErrorMessage.contractTimestampNotFound)
            })
    }

    getInput(): void {
        this.$apollo
            .query({
                query: getContractInput,
                variables: {
                    address: this.address,
                    chainId: 1
                },
                client: 'ContractsClient',
                fetchPolicy: 'cache-first'
            })
            .then(response => {
                console.log(response.data.getContractInput)
                if (response.data && response.data.getContractInput) {
                    this.input = response.data.getContractInput
                    this.isVerified = true
                }
                this.isLoadingInput = false
            })
            .catch(error => {
                console.log('Error in input: ', error)
                // this.emitErrorState(true, ErrorMessage.contractTimestampNotFound)
            })
    }

    getConfigs(): void {
        this.$apollo
            .query({
                query: getContractConfigs,
                variables: {
                    address: this.address,
                    chainId: 1
                },
                client: 'ContractsClient',
                fetchPolicy: 'cache-first'
            })
            .then(response => {
                if (response.data && response.data.getContractConfigs) {
                    this.configs = response.data.getContractConfigs
                    // this.timestampRaw = response.data.getTransactionByHash.timestamp
                    // this.isLoadingTimestamp = false
                    this.isVerified = true
                }
                this.isLoadingConfigs = false
            })
            .catch(error => {
                console.log('Error in configs: ', error)
                // this.emitErrorState(true, ErrorMessage.contractTimestampNotFound)
            })
    }

    /**
     * Emits error to Sentry
     */
    emitErrorState(val: boolean, message: string): void {
        this.hasError = val
        this.$emit('errorAddrOverview', this.hasError, message)
    }
}
</script>

<style scoped lang="scss">
.contract-layout {
    border: 1px solid #efefef;
    border-radius: 4px;
    padding: 1px 0px;
}
.content-border {
    // border-top: 1px solid #efefef;
}

.v-expansion-panel:before {
    box-shadow: none !important;
}
</style>
