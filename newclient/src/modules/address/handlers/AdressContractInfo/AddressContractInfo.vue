<template>
    <div v-if="isContract" class="pa-2">
        <!--
        =====================================================================================
          Overview
        =====================================================================================
        -->
        <div class="contract-layout mb-3">
            <v-expansion-panel v-model="panelOverview" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">
                            {{ $t('contract.overview') }}
                        </p>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsOverview"> </app-details-list>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
        <!--
        =====================================================================================
          Source Contract
        =====================================================================================
        -->
        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelSource" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <v-layout row wrap align-center justify-start pr-2 pl-2 pb-1 pt-2 mb-0>
                            <p class="title font-weight-bold">{{ $t('contract.source-code') }}</p>
                            <v-icon small class="txSuccess--text fas fa-check pl-2" />
                        </v-layout>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsSource" />
                        </v-flex>
                        <v-flex xs12>
                            <v-divider class="lineGrey" />
                        </v-flex>
                        <!--
                        =====================================================================================
                          Source Files Header
                        =====================================================================================
                        -->
                        <v-flex xs12>
                            <v-layout row wrap align-center justify-start px-3 mb-1>
                                <p class="subheading font-weight-medium px-2">
                                    {{ $t('contract.source-code-files') }}
                                </p>
                                <v-spacer />
                                <!--
                                =====================================================================================
                                  Outline
                                =====================================================================================
                                -->
                                <v-menu v-if="input.sources.length > 1" v-model="viewOutline" offset-y>
                                    <template #activator="{ on }">
                                        <v-btn outline color="secondary" class="text-capitalize font-weight-regular pa-1" small v-on="on">
                                            <v-layout row align-center justify-space-between>
                                                <v-flex grow>
                                                    <p>{{ $t('contract.outline') }}</p>
                                                </v-flex>
                                                <v-flex>
                                                    <v-icon :class="[viewOutline ? 'fas fa-angle-up' : 'fas fa-angle-down', ' small-global-icon-font ']" />
                                                </v-flex>
                                            </v-layout>
                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-tile v-for="(i, index) in input.sources" :key="index" @click="scrollToFile(i.name)">
                                            <v-list-tile-content>
                                                <p :class="['body-1 pl-2']">{{ i.name }}</p>
                                            </v-list-tile-content>
                                        </v-list-tile>
                                    </v-list>
                                </v-menu>
                            </v-layout>
                        </v-flex>
                        <!--
                        =====================================================================================
                          Source Files
                        =====================================================================================
                        -->
                        <v-flex xs12>
                            <div v-for="(i, index) in input.sources" :id="i.name" :key="i.name" class="mb-4 file-container">
                                <div :class="'file-header file-header-color'">
                                    <v-layout row wrap align-center justify-start class="px-3">
                                        <v-flex>
                                            <p class="info--text break-string font-weight-medium">
                                                {{ $t('contract.file-out-of', { n: index + 1, total: input.sources.length }) }}
                                                <span class="white--text font-weight-normal">{{ i.name }} </span>
                                            </p>
                                        </v-flex>
                                        <v-spacer />
                                        <v-flex>
                                            <v-layout row align-center justify-end class="px-3">
                                                <v-flex pa-1 shrink>
                                                    <app-btn-icon
                                                        :icon="!fileViews[index] ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'"
                                                        :tooltip-text="!fileViews[index] ? $t('contract.view-expand') : $t('contract.view-shrink')"
                                                        color="white"
                                                        @click="expandView(expand.FILE, index)"
                                                    />
                                                </v-flex>
                                                <v-flex shrink pa-1>
                                                    <app-copy-to-clip
                                                        :value-to-copy="i.content"
                                                        :tooltip-text="$t('contract.copy-file')"
                                                        color="white"
                                                        :is-custom="true"
                                                        :custom-message="$t('contract.copied-file', { name: i.name })"
                                                    />
                                                </v-flex>
                                            </v-layout>
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
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
        <!--
        =====================================================================================
          ABI
        =====================================================================================
        -->
        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelAbi" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">{{ $t('contract.abi') }}</p>
                    </template>

                    <div class="mb-4 mt-2 file-container">
                        <div :class="[abiSticky, 'file-header-color']">
                            <v-layout row wrap align-center justify-space-between class="px-3">
                                <v-spacer />
                                <v-flex pa-1 shrink>
                                    <app-btn-icon
                                        :icon="!expandAbi ? 'fas fa-angle-double-down' : 'fas fa-angle-double-up'"
                                        :tooltip-text="!expandAbi ? $t('contract.view-expand') : $t('contract.view-shrink')"
                                        color="white"
                                        @click="expandView(expand.ABI, 0)"
                                    />
                                </v-flex>
                                <v-flex shrink pa-1>
                                    <app-copy-to-clip
                                        :value-to-copy="meta.abiStringify"
                                        :tooltip-text="$t('contract.copy-file')"
                                        color="white"
                                        :is-custom="true"
                                        :custom-message="$t('contract.copied-abi')"
                                    />
                                </v-flex>
                            </v-layout>
                        </div>
                        <prism-component
                            :code="meta.abiStringify"
                            language="json"
                            :class="[{ 'expand-source': !expandAbi }, 'contract-source-code line-numbers']"
                        >
                        </prism-component>
                    </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
        <!--
        =====================================================================================
          Meta
        =====================================================================================
        -->
        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelMeta" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">
                            {{ $t('contract.meta') }}
                        </p>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsMeta"> </app-details-list>
                        </v-flex>
                    </v-layout>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
        <!--
        =====================================================================================
          Other
        =====================================================================================
        -->
        <div v-if="!isLoadingDetails && isVerified" class="contract-layout mb-3">
            <v-expansion-panel v-model="panelOther" class="elevation-0">
                <v-expansion-panel-content>
                    <template #header>
                        <p class="title font-weight-bold">
                            {{ $t('contract.other') }}
                        </p>
                    </template>
                    <v-layout row wrap justify-start>
                        <v-flex xs12>
                            <app-details-list :is-loading="isLoadingDetails" :has-title="false" :details="detailsByteCode"> </app-details-list>
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
import AppAdrChip from '@app/core/components/ui/AppAdrChip.vue'
import AppBtnIcon from '@app/core/components/ui/AppBtnIcon.vue'
import AppCopyToClip from '@app/core/components/ui/AppCopyToClip.vue'
import { getContractInfo, getContractTimestamp, getContractInput, getContractConfigs, getContractMetaVerified } from './addressContractInfo.graphql'
import { getContractMetaVerified_getContractMetaVerified as ContractMeta } from './apolloTypes/getContractMetaVerified'
import { getContractConfigs_getContractConfigs as ContractConfigs } from './apolloTypes/getContractConfigs'
import { getContractInput_getContractInput as ContractInput } from './apolloTypes/getContractInput'
import { getContractInfo_getContractMeta as ContractInfo } from './apolloTypes/getContractInfo'
import { ErrorMessage } from '@app/modules/address/models/ErrorMessagesForAddress'
import { excpAddrNotContract } from '@app/apollo/exceptions/errorExceptions'
import { Detail } from '@app/core/components/props'
import { EnumAdrChips } from '@app/core/components/props'
import PrismComponent from 'vue-prism-component'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.min.css'
import 'prismjs/components/prism-solidity.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

const EXPAND_TYPES = {
    FILE: 'FILE',
    ABI: 'ABI',
    META: 'META'
}
@Component({
    components: {
        AppDetailsList,
        PrismComponent,
        AppBtnIcon,
        AppAdrChip,
        AppCopyToClip
    },
    apollo: {
        getContractInfo: {
            query: getContractInfo,
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
                    this.isContract = true
                    this.emitErrorState(false)
                    this.setContract(true)
                    this.getTimestamp(data.data.getContractMeta)
                    this.getInput()
                    this.getConfigs()
                    this.getMeta()
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
    isContract = false
    hasError = false
    getContractInfo!: ContractInfo
    skipContract = false
    isLoadingConfigs = true
    isLoadingInput = true
    isLoadingTimestamp = true
    isLoadingMeta = true
    timestampRaw: number | null = null
    input: ContractInput | null = null
    configs: ContractConfigs | null = null
    meta: ContractMeta | null = null
    panelOverview = 0
    panelSource = 0
    panelAbi = 0
    panelMeta = 0
    panelOther = 0
    fileViews: boolean[] = []
    expandAbi = false
    verifiedChip = EnumAdrChips.verified
    expand = EXPAND_TYPES
    abiSticky = 'file-header'
    viewOutline = false

    /*
    ===================================================================================
      Computed Values
    ===================================================================================
    */
    get isVerified(): boolean {
        return !(this.meta === null || this.input === null || this.configs == null)
    }
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
                    detail: this.getContractInfo.transactionHash,
                    link: `/tx/${this.getContractInfo.transactionHash}`,
                    copy: true,
                    mono: true
                },
                {
                    title: this.$i18n.t('contract.creator'),
                    detail: this.getContractInfo.creator,
                    link: `/address/${this.getContractInfo.creator}`,
                    copy: true,
                    mono: true,
                    toChecksum: true
                },
                {
                    title: this.$i18n.t('contract.code-hash'),
                    detail: this.getContractInfo.codeHash,
                    copy: true,
                    mono: true
                }
            ]
            if (this.isVerified && this.configs && this.configs.name) {
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
        } else if (this.configs && this.input) {
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
                    detail:
                        this.configs.optimization && this.configs.runs !== null
                            ? `${this.$i18n.t('contract.optimization-true', { runs: this.configs.runs || 0 })}`
                            : `${this.$i18n.t('contract.optimization-false')}`
                },

                {
                    title: this.$i18n.t('contract.evm-version'),
                    detail: this.configs.evmVersion
                }
            ]
            if (this.configs.constructorBytes && this.configs.constructorBytes !== '') {
                details.push({
                    title: this.$i18n.t('contract.constructor-bytes'),
                    detail: this.configs.constructorBytes
                })
            }
        }
        return details
    }
    get detailsByteCode(): Detail[] {
        let details: Detail[] = []
        if (this.isLoadingInput || this.isLoadingConfigs) {
            details = [
                {
                    title: 'opcodeHash'
                },
                {
                    title: 'metalessHash'
                },
                {
                    title: 'runtimeHash'
                },
                {
                    title: 'Deployed Bytecode'
                }
            ]
        } else if (this.isVerified && this.meta) {
            details = [
                {
                    title: 'opcodeHash',
                    detail: this.meta.opcodeHash
                },
                {
                    title: 'metalessHash',
                    detail: this.meta.metalessHash
                },
                {
                    title: 'runtimeHash',
                    detail: this.meta.runtimeHash
                },
                {
                    title: 'Bytecode',
                    detail: this.meta.byteCode,
                    txInput: this.meta.byteCode
                },
                {
                    title: 'Deployed Bytecode',
                    detail: this.meta.deployedByteCode,
                    txInput: this.meta.deployedByteCode
                }
            ]
        }
        return details
    }
    get detailsMeta(): Detail[] {
        let details: Detail[] = []
        if (this.isLoadingDetails) {
            details = [
                {
                    title: this.$t('message.load')
                }
            ]
        } else if (this.meta) {
            this.meta.encodedMetadata.forEach(i => {
                const keys = Object.keys(i)
                keys.forEach(key => {
                    if (i[key] && key !== 'solc' && key !== '__typename') {
                        details.push({
                            title: key,
                            detail: i[key]
                        })
                    }
                })
            })
        }
        return details
    }
    get timestamp(): string {
        return this.timestampRaw ? new Date(this.timestampRaw * 1e3).toString() : ''
    }

    get isLoadingDetails(): boolean {
        return this.isLoadingConfigs || this.isLoadingInput || this.isLoadingMeta || this.isLoadingTimestamp
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
            setTimeout(() => Prism.highlightAll(), 0)
        }
    }
    @Watch('panelAbi')
    onPanelAbiChange(newVal: 0 | null): void {
        if (newVal === 0) {
            this.abiSticky = 'file-header-expanding'
            setTimeout(() => (this.abiSticky = 'file-header'), 1000)
        } else {
            this.abiSticky = ''
        }
    }
    /*
    ===================================================================================
      Methods
    ===================================================================================
    */
    getTimestamp(contract: ContractInfo) {
        this.$apollo
            .query({
                query: getContractTimestamp,
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
                if (response.data && response.data.getContractInput) {
                    this.input = response.data.getContractInput
                    if (this.input) {
                        this.fileViews = this.input.sources.map(i => false)
                    }
                }
                this.isLoadingInput = false
            })
            .catch(error => {
                this.isLoadingInput = false
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
                }
                this.isLoadingConfigs = false
            })
            .catch(error => {
                this.isLoadingConfigs = false
                console.log('Error in configs: ', error)
                // this.emitErrorState(true, ErrorMessage.contractTimestampNotFound)
            })
    }
    getMeta(): void {
        this.$apollo
            .query({
                query: getContractMetaVerified,
                variables: {
                    address: this.address,
                    chainId: 1
                },
                client: 'ContractsClient',
                fetchPolicy: 'cache-first'
            })
            .then(response => {
                if (response.data && response.data.getContractMetaVerified) {
                    this.meta = response.data.getContractMetaVerified
                }
                this.isLoadingMeta = false
            })
            .catch(error => {
                this.isLoadingMeta = false
                console.log('Error in meta: ', error)
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

    expandView(panel: string, index: number): void {
        if (panel === this.expand.FILE) {
            this.$set(this.fileViews, index, !this.fileViews[index])
        } else if (panel === this.expand.ABI) {
            this.expandAbi = !this.expandAbi
        }
    }
    scrollToFile(_id: string): void {
        const el = document.getElementById(_id)
        if (el) {
            const options = { duration: 1000, offset: -60 }
            this.$vuetify.goTo(el, { ...options })
        }
    }
}
</script>

<style scoped lang="scss">
.contract-layout {
    border: 1px solid #efefef;
    border-radius: 4px;
    padding: 1px 0px;
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
    max-height: 300px;
}
.file-header {
    position: sticky;
    right: 0;
    top: 56px;
    z-index: 1;
    left: 0;
    width: 100%;
    @media (min-width: 960px) {
        top: 64px;
    }
}
.file-header-expanding {
    position: sticky;
    right: 0;
    top: 0px;
    z-index: 1;
    left: 0;
    width: 100%;
}
.file-header-color {
    background-color: #2a3643;
}

.file-container {
    position: relative;
}
</style>
