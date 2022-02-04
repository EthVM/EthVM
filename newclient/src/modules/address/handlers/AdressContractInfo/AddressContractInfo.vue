<template>
    <div class="pa-2">
        <div class="contract-layout mb-3">
            <v-expansion-panel v-model="panelOverview" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">
                            Contract Overview
                        </p>
                        <!-- <app-adr-chip v-if="isVerified" :chip="verifiedChip" /> -->
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsOverview" class=""> </app-details-list>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>

        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelSource" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <v-layout row wrap align-center justify-start pr-2 pl-2 pb-2 pt-3>
                            <p class="title font-weight-bold">{{ $t('contract.source-code') }}</p>
                            <v-icon small class="txSuccess--text fas fa-check pl-2" />
                        </v-layout>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsSource" />
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>

        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelCode" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">Files</p>
                    </template>
                    <div v-for="(i, index) in input.sources" :key="i.name" class="mb-4 file-container">
                        <div :class="{ 'file-header': (panelCode = 0) }">
                            <v-layout row wrap align-center justify-space-between class="px-3">
                                <v-flex>
                                    <p class="info--text break-string">
                                        File {{ index + 1 }} out of {{ input.sources.length }}: <span class="primary--text">{{ i.name }} </span>
                                    </p>
                                </v-flex>
                                <v-spacer />
                                <v-flex pa-1 shrink>
                                    <app-btn-icon
                                        :icon="!fileViews[index] ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'"
                                        :tooltip-text="!fileViews[index] ? 'Expand File View' : 'Shrink file view'"
                                        color="white"
                                        @click="expandView(index)"
                                    />
                                </v-flex>
                                <v-flex shrink pa-1>
                                    <app-btn-icon @ icon="far fa-copy" tooltip-text="Copy file content" color="white" @click="expandView(index)" />
                                </v-flex>
                            </v-layout>
                        </div>
                        <prism-component
                            :code="i.content"
                            language="solidity"
                            :class="[{ 'expand-source': !fileViews[index] }, 'contract-source-code line-numbers']"
                        >
                        </prism-component>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import AppDetailsList from '@app/core/components/ui/AppDetailsList.vue'
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import AppBtnIcon from '@app/core/components/ui/AppBtnIcon.vue'
import { getContractMeta1, getContractTimestamp1, getContractInput, getContractConfigs } from './addressContractInfo.graphql'
import { getContractMeta1_getContractMeta as ContractMeta } from './apolloTypes/getContractMeta1'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { excpAddrNotContract } from '@app/apollo/exceptions/errorExceptions'
import { Detail } from '@app/core/components/props'
import { EnumAdrChips } from '@app/core/components/props'
import PrismComponent from 'vue-prism-component'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.min.css'
import 'prismjs/components/prism-solidity.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

@Component({
    components: {
        AppDetailsList,
        PrismComponent,
        AppBtnIcon,
        AppAdrChip
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
export default class AddressContractInfo extends Vue {
    /*
    ===================================================================================
      Props
    ===================================================================================
    */

    @Prop(String) address!: string
    @Prop(Function) setContract!: void
    /*
    ===================================================================================
      Initial Data
    ===================================================================================
    */
    hasError = false
    getContractMeta!: ContractMeta
    skipContract = false
    isLoadingConfigs = true
    isLoadingInput = true
    isLoadingTimestamp = true
    timestampRaw: number | null = null
    input!: any
    configs!: any
    isVerified = false
    panelOverview = 0
    panelSource = 0
    panelCode = 0
    fileViews: boolean[] = []
    verifiedChip = EnumAdrChips.verified

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
        return this.isLoadingConfigs || this.isLoadingInput
    }
    get loading(): boolean {
        return this.hasError ? true : this.$apollo.queries.getEthBalance.loading
    }
    /*
    ===================================================================================
      Watch
    ===================================================================================
    */
    @Watch('isLoadingDetails')
    onIsLoadingDetailsChanged(newVal: boolean): void {
        if (!newVal && this.isVerified) {
            console.log(Prism)
            setTimeout(() => Prism.highlightAll(), 0)
        }
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
                // console.log(response.data.getContractInput)
                if (response.data && response.data.getContractInput) {
                    this.input = response.data.getContractInput
                    this.fileViews = this.input.sources.map(i => false)

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

    expandView(index: number): void {
        this.$set(this.fileViews, index, !this.fileViews[index])
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

.contract-source-code {
    font-size: 14px;
    line-height: 1.5;
    font-size: 12px;
    code {
        box-shadow: none !important;
    }
}

.expand-source {
    max-height: 360px;
}
.file-header {
    position: sticky;
    right: 0;
    top: 0px;
    z-index: 1;
    left: 0;
    width: 100%;
    background-color: white;
    @media (min-width: 960px) {
        top: 64px;
    }
}

.file-container {
    position: relative;
}
</style>
